import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { TourDto } from "./dto/tour.dto";
import { iTour } from "./interfaces/tours.interface";
import { Tour } from "./schemas/tour.schema";
import { LocationService } from "src/location/locations.service";
import { TourNotFoundException } from "src/excepetions/TourNotFound.excp";

@Injectable()
export class ToursService {
    constructor(
        @InjectModel(Tour.name) private readonly tourModel: Model<iTour>,
        private readonly locationService: LocationService
    ) {}

    async deleteTour(title: string) {
        return await this.tourModel.findOneAndDelete({ title });
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
            { populate: ["country", "city"] }
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
            { populate: ["country", "city"] }
        );
        if (!tours || !tours.length) throw new TourNotFoundException();

        return tours;
    }

    async getTour(name: string) {
        return await this.tourModel.findOne(
            { name },
            { populate: ["country", "city"] }
        );
    }
}
