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
        const countryList = await this.locationService.getCity(tourDto.city);
        const tourExist = await this.tourModel.findOne({ name: tourDto.name });
        if (tourExist) throw new TourExistException();

        const cityList = [];
        for (const country of countryList) {
            cityList.push(...country.cityList);
        }

        const city = cityList.find(
            (x) => x.name === tourDto.city || x.persianName === tourDto.city
        );
        return await this.tourModel.create({
            ...tourDto,
            city: city,
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
        const tours = await this.tourModel.find({
            city: isPersianName
                ? { persianName: cityName }
                : { name: cityName },
        });
        if (!tours || !tours.length) throw new TourNotFoundException();

        return tours;
    }

    async getCountryTours(countryName: string, isPersianName = false) {
        const country = await this.locationService.getCountry(
            countryName,
            isPersianName
        );
        const tours = await this.tourModel.find({
            city: { country: country._id },
        });
        if (!tours || !tours.length) throw new TourNotFoundException();

        return tours;
    }

    async getTour(id: string) {
        const tour = await this.tourModel.findById(id);
        if (!tour) throw new TourNotFoundException();

        return tour;
    }
}
