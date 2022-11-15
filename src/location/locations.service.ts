import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CityExistException } from "src/excepetions/CityExist.excp";
import { CountryExistException } from "src/excepetions/CountryExist.excp";
import { CountryNotFoundException } from "src/excepetions/CountryNotFound.excp";
import { iCity } from "./interfaces/city.interface";
import { iLocation } from "./interfaces/location.interface";
import { City } from "./schemas/city.schema";
import { Location } from "./schemas/location.schema";

@Injectable()
export class LocationService {
    constructor(
        @InjectModel(City.name) private readonly cityModel: Model<iCity>,
        @InjectModel(Location.name)
        private readonly locationModel: Model<iLocation>
    ) {}

    private async registerCity(name: string, countryName?: string) {
        let country: iLocation;
        const cityExist = await this.cityModel.findOne({ name });
        if (countryName) {
            country = await this.locationModel.findOne({ countryName });
            if (!country) throw new CountryNotFoundException();
        }
        if (cityExist) throw new CityExistException();

        const city = await this.cityModel.create({
            name,
        });

        if (country) {
            country.cities.push(city._id);
            return await country.save();
        } else return city;
    }

    async registerLocation(
        countryName: string,
        persianName: string,
        cities: string[] = []
    ) {
        const country = await this.locationModel.findOne({
            countryName,
            persianName,
        });
        if (country) throw new CountryExistException();

        const cityIds: string[] = [];
        if (cities) {
            for (const city of cities) {
                const icity = await this.cityModel.findOne({ name: city });
                if (icity) cityIds.push(icity._id);
                else {
                    const newCity = await this.registerCity(city);
                    cityIds.push(newCity._id);
                }
            }
        }

        return await this.locationModel.create({
            countryName,
            persianName,
            cities: cityIds,
        });
    }
}
