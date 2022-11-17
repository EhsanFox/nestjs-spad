import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CityExistException } from "src/excepetions/CityExist.excp";
import { CityNotFoundException } from "src/excepetions/CityNotFound.excp";
import { CountryExistException } from "src/excepetions/CountryExist.excp";
import { CountryNotFoundException } from "src/excepetions/CountryNotFound.excp";
import { CityDto } from "./dto/city.dto";
import { CountryDto } from "./dto/country.dto";
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

    async registerCity(cityDto: CityDto) {
        const city = await this.cityModel.findOne({ name: cityDto.name });
        if (city) throw new CityExistException();

        const countryObj = this.countryModel.findOne({ name: cityDto.country });
        if (!countryObj) throw new CountryNotFoundException();

        return await this.cityModel.create({
            ...cityDto,
        });
    }

    async registerCountry(countryDto: CountryDto) {
        const country = await this.countryModel.findOne({
            name: countryDto.name,
        });
        if (country) throw new CountryExistException();

        return await this.countryModel.create({
            ...countryDto,
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
        return await this.countryModel.find();
    }

    async getAllCity() {
        return await this.cityModel.find({}, { populate: "country" });
    }

    async updateCity(_id: string, cityDto: CityDto) {
        const city = await this.cityModel.findById(_id);
        if (!city) throw new CityNotFoundException();

        return await this.cityModel.findByIdAndUpdate(
            _id,
            { ...cityDto },
            { new: true }
        );
    }

    async updateCountry(_id: string, countryDto: CountryDto) {
        const country = await this.countryModel.findById(_id);
        if (!country) throw new CountryNotFoundException();

        return await this.countryModel.findByIdAndUpdate(
            _id,
            { ...countryDto },
            { new: true }
        );
    }

    async deleteCity(_id: string) {
        const city = await this.cityModel.findById(_id);
        if (!city) throw new CityNotFoundException();

        return await this.cityModel.findByIdAndDelete(_id);
    }

    async deleteCountry(_id: string) {
        const country = await this.countryModel.findById(_id);
        if (!country) throw new CountryNotFoundException();

        return await this.countryModel.findByIdAndDelete(_id);
    }
}
