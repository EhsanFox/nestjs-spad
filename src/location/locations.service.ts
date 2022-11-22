import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CityExistException } from "src/excepetions/CityExist.excp";
import { CityNotFoundException } from "src/excepetions/CityNotFound.excp";
import { CountryExistException } from "src/excepetions/CountryExist.excp";
import { CountryNotFoundException } from "src/excepetions/CountryNotFound.excp";
import { CityDto } from "./dto/city.dto";
import { CountryDto } from "./dto/country.dto";
import { iCity } from "../shared/interfaces/city.interface";
import { iCountry } from "../shared/interfaces/country.interface";
import { Country } from "../shared/schemas/country.schema";

@Injectable()
export class LocationService {
    constructor(
        @InjectModel(Country.name)
        private readonly countryModel: Model<iCountry>
    ) {}

    async registerCity(cityDto: CityDto) {
        const country = await this.getCountry(cityDto.country);
        if (!country) throw new CountryNotFoundException();

        const cityExist = country.cityList.find(
            (x) =>
                x.name == cityDto.name || x.persianName == cityDto.persianName
        );
        if (cityExist) throw new CityExistException();

        country.cityList.push(cityDto as iCity);
        return await country.save();
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
        const query = (await this.countryModel.aggregate([
            { $match: { "cityList.isPopular": true } },
            {
                $project: {
                    cityList: {
                        $filter: {
                            input: "$cityList",
                            as: "item",
                            cond: {
                                $eq: ["$$item.isPopular", true],
                                // $regex: new RegExp(`^${keyword.toLowerCase()}`, "i")
                            },
                        },
                    },
                },
            },
        ])) as iCountry[];
        if (!query || !query.length) throw new CityNotFoundException();

        return query;
    }

    async getCountryByRegex(keyword: string, isPersianName = false) {
        return await this.countryModel.find(
            isPersianName
                ? {
                      persianName: {
                          $regex: new RegExp(`^${keyword.toLowerCase()}`, "i"),
                      },
                  }
                : {
                      name: {
                          $regex: new RegExp(`^${keyword.toLowerCase()}`, "i"),
                      },
                  }
        );
    }

    async getCityByRegex(keyword: string, isPersianName = false) {
        const query = (await this.countryModel.aggregate([
            {
                $match: isPersianName
                    ? {
                          "cityList.persianName": {
                              $regex: new RegExp(
                                  `^${keyword.toLowerCase()}`,
                                  "i"
                              ),
                          },
                      }
                    : {
                          "cityList.name": {
                              $regex: new RegExp(
                                  `^${keyword.toLowerCase()}`,
                                  "i"
                              ),
                          },
                      },
            },
            {
                $project: {
                    cityList: {
                        $filter: {
                            input: "$cityList",
                            as: "item",
                            cond: {
                                $regexMatch: {
                                    input: isPersianName
                                        ? "$$item.persianName"
                                        : "$$item.name",
                                    regex: new RegExp(
                                        `^${keyword.toLowerCase()}`,
                                        "i"
                                    ),
                                    options: "i",
                                },
                            },
                        },
                    },
                },
            },
        ])) as iCountry[];
        if (!query || !query.length) throw new CountryNotFoundException();

        return query;
    }

    async getCountry(name: string, isPersianName = false) {
        if (isPersianName)
            return await this.countryModel.findOne({ persianName: name });
        else return await this.countryModel.findOne({ name });
    }

    async getCity(name: string, isPersianName = false) {
        const query = (await this.countryModel.aggregate([
            {
                $match: isPersianName
                    ? { "cityList.persianName": name }
                    : { "cityList.name": name },
            },
            {
                $project: {
                    cityList: {
                        $filter: {
                            input: "$cityList",
                            as: "item",
                            cond: {
                                $eq: isPersianName
                                    ? ["$$item.persianName", name]
                                    : ["$$item.name", name],
                            },
                        },
                    },
                },
            },
        ])) as iCountry[];

        if (!query || !query.length) throw new CityNotFoundException();
        return query;
    }

    async getCountryCities(country: string, isPersianName = false) {
        const result = await this.countryModel.find(
            isPersianName ? { persianName: country } : { name: country }
        );
        if (!result) throw new CountryNotFoundException();

        return result;
    }

    async getAllCountry() {
        return await this.countryModel.find();
    }

    async getAllCity() {
        return await this.countryModel.find();
    }

    async updateCity(cityDto: CityDto) {
        const country = await this.countryModel.findOne({
            name: cityDto.country,
        });
        if (!country) throw new CountryNotFoundException();

        const cityIndex = country.cityList.findIndex(
            (x) =>
                x.name === cityDto.name || x.persianName === cityDto.persianName
        );
        if (cityIndex < 0) throw new CityNotFoundException();
        country.cityList[cityIndex] = cityDto as iCity;

        return await country.save();
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

    async deleteCity(countryName: string, name: string, isPersianName = false) {
        const country = await this.countryModel.findOne({ name: countryName });
        if (!country) throw new CountryNotFoundException();

        const cityIndex = country.cityList.findIndex((x) =>
            isPersianName ? x.persianName === name : x.name === name
        );
        if (cityIndex < 0) throw new CityNotFoundException();

        country.cityList.splice(cityIndex, 1);
        return await country.save();
    }

    async deleteCountry(_id: string) {
        const country = await this.countryModel.findById(_id);
        if (!country) throw new CountryNotFoundException();

        return await this.countryModel.findByIdAndDelete(_id);
    }
}
