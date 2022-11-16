import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { RegisteTourDto } from "./dto/registerTour.dto";
import { iLocation } from "../location/interfaces/location.interface";
import { iTour } from "./interfaces/tours.interface";
import { Tour } from "./schemas/tour.schema";
import { Location } from "src/location/schemas/location.schema";
import { LocationService } from "src/location/locations.service";
import { BuyTourDto } from "./dto/buyTour.dto";
import { TourNotFoundException } from "src/excepetions/TourNotFound.excp";
import { TourClosedException } from "src/excepetions/TourClosed.excp";
import { CountryNotFoundException } from "src/excepetions/CountryNotFound.excp";
import { UpdateTourDto } from "./dto/updateTour.dto";

@Injectable()
export class ToursService {
    constructor(
        @InjectModel(Location.name)
        private readonly locationModel: Model<iLocation>,
        @InjectModel(Tour.name) private readonly tourModel: Model<iTour>,
        private readonly locationService: LocationService
    ) {}

    async getAll(inOrder = true) {
        const allTours = await this.tourModel
            .find()
            .populate("location")
            .populate("cities")
            .populate("customers");
        return inOrder
            ? allTours.sort((a, b) => a.priority - b.priority)
            : allTours;
    }

    async getCountryTours(name: string, englishName = true) {
        const country = await this.locationModel.findOne(
            englishName ? { countryName: name } : { persianName: name }
        );
        if (!country) throw new CountryNotFoundException();
        const data = await this.tourModel
            .find({ location: country._id })
            .populate("location")
            .populate("cities")
            .populate("customers");
        return data.sort((a, b) => a.priority - b.priority);
    }

    async registerTour(tourDto: RegisteTourDto) {
        let country = await this.locationModel.findOne({
            countryName: tourDto.countryName,
            persianName: tourDto.persianCountryName,
        });
        if (!country) {
            country = await this.locationService.registerLocation(
                tourDto.countryName,
                tourDto.persianCountryName,
                tourDto.cities
            );
        }

        const diffHours =
            Math.abs(
                new Date(tourDto.arrivalDate as string).getTime() -
                    new Date(tourDto.departureDate as string).getTime()
            ) / 36e5;
        const days = diffHours / 24;
        const nights = diffHours % 24 === days ? days : days - 1;
        const data = await this.tourModel.create({
            title: tourDto.title,
            location: country._id,
            cities: country.cities,
            priority: tourDto.priority,
            seats: tourDto.seats,
            price: tourDto.price,
            includedMeals: tourDto.meals,
            startRegisterDate: tourDto.startRegisterDate,
            endRegisterDate: tourDto.endRegisterDate,
            arrivalDate: tourDto.arrivalDate,
            departureDate: tourDto.departureDate,
            stayingDays: days.toFixed(0),
            stayingNights: nights.toFixed(0),
        });

        const popResult = await data.populate("cities");
        const popResultLoc = await popResult.populate("location");
        const result = await popResultLoc.populate("customers");
        return result;
    }

    async updateTour(_id: string, tourDto: UpdateTourDto) {
        const tour = await this.tourModel.findById(_id);
        if (!tour) throw new TourNotFoundException();

        // Handle updated Staying Nights and DAys
        let days = tour.stayingDays,
            nights = tour.stayingNights;
        if (tourDto.arrivalDate || tourDto.departureDate) {
            const diffHours =
                Math.abs(
                    new Date(
                        tourDto.arrivalDate
                            ? (tourDto.arrivalDate as string)
                            : (tour.arrivalDate as string)
                    ).getTime() -
                        new Date(
                            tourDto.departureDate
                                ? (tourDto.departureDate as string)
                                : (tour.departureDate as string)
                        ).getTime()
                ) / 36e5;
            days = diffHours / 24;
            nights = diffHours % 24 === days ? days : days - 1;
        }

        return await this.tourModel.findByIdAndUpdate(
            _id,
            {
                ...tourDto,
                stayingDays: days,
                stayingNights: nights,
            },
            { new: true }
        );
    }

    async deleteTour(_id: string) {
        const tour = await this.tourModel.findById(_id);
        if (!tour) throw new TourNotFoundException();

        return await this.tourModel.findByIdAndDelete(_id);
    }

    async buyTour(buyDto: BuyTourDto) {
        const today = new Date();
        const tour = await this.tourModel.findOne({
            title: buyDto.title,
        });
        if (!tour) throw new TourNotFoundException();
        if (
            new Date(tour.endRegisterDate as string) < today ||
            new Date(tour.startRegisterDate as string) < today
        )
            throw new TourClosedException();
        if (tour.seats >= buyDto.passengerCount) {
            tour.seats = tour.seats - buyDto.passengerCount;
            //tour.customers.push("1234-user"); //TODO: Add AuthGaurd and Get UserID from Controller
            const result = await tour.save();
            const popResult = await result.populate("location");
            const popResultFinal = await popResult.populate("cities");
            return popResultFinal;
        } else throw new TourClosedException();
    }
}
