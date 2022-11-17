import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CityExistException } from "src/excepetions/CityExist.excp";
import { CountryExistException } from "src/excepetions/CountryExist.excp";
import { CountryNotFoundException } from "src/excepetions/CountryNotFound.excp";
import { iCity } from "./interfaces/city.interface";
import { iCountry } from "./interfaces/country.interface";
import { City } from "./schemas/city.schema";
import { Country } from "./schemas/country.schema";

@Injectable()
export class LocationService {
    constructor(
        @InjectModel(City.name) private readonly cityModel: Model<iCity>,
        @InjectModel(Country.name)
        private readonly countryModel: Model<iCountry>
    ) {}

    async registerCity(
        country: string,
        name: string,
        persianName: string,
        image: Buffer,
        isPopular = false
    ) {
        const city = await this.cityModel.findOne({ name });
        if (city) throw new CityExistException();

        const countryObj = this.countryModel.findOne({ name: country });
        if (!countryObj) throw new CountryNotFoundException();

        return await this.cityModel.create({
            country,
            name,
            persianName,
            image,
            isPopular,
        });
    }

    async registerCountry(
        countryName: string,
        persianName: string,
        description: string,
        image: Buffer
    ) {
        const country = await this.countryModel.findOne({ name: countryName });
        if (country) throw new CountryExistException();

        return await this.countryModel.create({
            name: countryName,
            persianName,
            description,
            image,
        });
    }

    async getPopularCities() {
        return await this.cityModel.find({ isPopular: true });
    }

    async getCountryByRegex(keyword: string, persianName = false) {
        if (persianName)
            return await this.countryModel.find({
                persianName: {
                    $regex: new RegExp(`^${keyword.toLowerCase()}`, "i"),
                },
            });
        else
            return await this.countryModel.find({
                name: {
                    $regex: new RegExp(`^${keyword.toLowerCase()}`, "i"),
                },
            });
    }

    async getCityByRegex(keyword: string, persianName = false) {
        if (persianName)
            return await this.cityModel.find({
                persianName: {
                    $regex: new RegExp(`^${keyword.toLowerCase()}`, "i"),
                },
            });
        else
            return await this.cityModel.find({
                name: { $regex: new RegExp(`^${keyword.toLowerCase()}`, "i") },
            });
    }

    async getCountry(name: string, isPersianName = false) {
        if (isPersianName)
            return await this.countryModel.findOne({ persianName: name });
        else return await this.countryModel.findOne({ name });
    }

    async getCity(name: string, isPersianName = false) {
        if (isPersianName)
            return await this.cityModel.findOne({ persianName: name });
        else return await this.cityModel.findOne({ name });
    }

    async getAllCountry() {
        const list = await this.countryModel.find();
    }
}
