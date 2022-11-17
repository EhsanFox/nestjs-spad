import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { TourDto } from "./dto/tour.dto";
import { iTour } from "./interfaces/tours.interface";
import { Tour } from "./schemas/tour.schema";
import { LocationService } from "src/location/locations.service";
import { TourNotFoundException } from "src/excepetions/TourNotFound.excp";
import { TourExistException } from "src/excepetions/TourExist.excp";

@Injectable()
export class ToursService {
    constructor(
        @InjectModel(Tour.name) private readonly tourModel: Model<iTour>,
        private readonly locationService: LocationService
    ) {}

    async registerTour(tourDto: TourDto) {
        const city = await this.locationService.getCity(tourDto.city);
        const tourExist = await this.tourModel.findOne({ name: tourDto.name });
        if (tourExist) throw new TourExistException();

        return await this.tourModel.create({
            ...tourDto,
            city: city._id,
        });
    }

    async updateTour(_id: string, tourDto: TourDto) {
        const tour = await this.tourModel.findById(_id);
        if (!tour) throw new TourNotFoundException();

        return await this.tourModel.findByIdAndUpdate(
            _id,
            { ...tourDto },
            { new: true }
        );
    }

    async deleteTour(_id: string) {
        return await this.tourModel.findByIdAndDelete(_id);
    }

    async getPopularTours() {
        return await this.tourModel.find({ isPopular: true });
    }

    async getCityTours(cityName: string, isPersianName = false) {
        const city = await this.locationService.getCity(
            cityName,
            isPersianName
        );
        const tours = await this.tourModel.find(
            { city: city._id },
            { populate: "city" }
        );
        if (!tours || !tours.length) throw new TourNotFoundException();

        return tours;
    }

    async getCountryTours(countryName: string, isPersianName = false) {
        const country = await this.locationService.getCountry(
            countryName,
            isPersianName
        );
        const tours = await this.tourModel.find(
            { country: country._id },
            { populate: "city" }
        );
        if (!tours || !tours.length) throw new TourNotFoundException();

        return tours;
    }

    async getTour(id: string) {
        const tour = await this.tourModel.findById(id, { populate: "city" });
        if (!tour) throw new TourNotFoundException();

        return tour;
    }
}
