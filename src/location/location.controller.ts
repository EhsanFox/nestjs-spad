import {
    ClassSerializerInterceptor,
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    UseInterceptors,
    UseGuards,
    Query,
    UploadedFile,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import * as mimetypes from "mime-types";
import { CityNotFoundException } from "src/excepetions/CityNotFound.excp";
import { CountryNotFoundException } from "src/excepetions/CountryNotFound.excp";
import { AuthGuard } from "src/shared/auth.guard";
import { UploadStorage } from "src/shared/images.storage";
import { iCity } from "src/shared/interfaces/city.interface";
import { UploadFilePipe } from "src/shared/uploadfile.pipe";
import { CityDto } from "./dto/city.dto";
import { CityOutputDto } from "./dto/cityOutput.dto";
import { CountryDto } from "./dto/country.dto";
import { CountryOutputDto } from "./dto/countryOutput.dto";
import { LocationService } from "./locations.service";

@Controller("location")
export class LocationController {
    constructor(private readonly locationService: LocationService) {}

    @UseInterceptors(ClassSerializerInterceptor)
    @Get("search/city")
    async searchCity(
        @Query("keyword") keyword: string,
        @Query("english") isEnglishName = true
    ): Promise<CityOutputDto[]> {
        const list = await this.locationService.getCityByRegex(
            keyword,
            !isEnglishName
        );
        if (!list || !list.length) throw new CityNotFoundException();

        const cityList = [];
        for (const country of list) cityList.push(...country.cityList);

        return cityList.map((x) => new CityOutputDto(x));
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get("search/country")
    async searchCountry(
        @Query("keyword") keyword: string,
        @Query("english") isEnglishName = true
    ): Promise<CountryOutputDto[]> {
        const list = await this.locationService.getCountryByRegex(
            keyword,
            !isEnglishName
        );
        if (!list || !list.length) throw new CountryNotFoundException();

        for (const country of list) {
            country.cityList.map(
                (x) => new CityOutputDto(x as unknown as CityOutputDto)
            );
        }

        return list.map(
            (x) => new CountryOutputDto(x as unknown as CountryOutputDto)
        );
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get("city")
    async getCity(
        @Query("name") name?: string,
        @Query("persianName") persianName?: string,
        @Query("country") country?: string
    ): Promise<CityOutputDto[] | CityOutputDto> {
        const city = name ?? persianName;
        const isPersianName = persianName !== undefined ? true : false;
        if (city == undefined) {
            if (country == undefined) {
                const list = await this.locationService.getAllCity();
                return list.map(
                    (x) => new CityOutputDto(x as unknown as CityOutputDto)
                );
            } else {
            }
        } else {
            const countryList = await this.locationService.getCity(
                city,
                isPersianName
            );
            if (!countryList || !countryList.length)
                throw new CityNotFoundException();

            const cityObj: iCity[] = [];
            if (countryList.length <= 1)
                cityObj.push(...countryList[0].cityList);
            else {
                for (const country of countryList) {
                    cityObj.push(...country.cityList);
                }
            }
            return cityObj.map(
                (x) => new CityOutputDto(x as unknown as CityOutputDto)
            );
        }
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get("country")
    async getAllCountry(): Promise<CountryOutputDto[]> {
        const list = await this.locationService.getAllCountry();
        for (const country of list) {
            country.cityList.map(
                (x) => new CityOutputDto(x as unknown as CityOutputDto)
            );
        }
        return list.map(
            (x) => new CountryOutputDto(x as unknown as CountryOutputDto)
        );
    }

    @UseGuards(AuthGuard)
    @UseInterceptors(
        ClassSerializerInterceptor,
        FileInterceptor("image", { storage: UploadStorage })
    )
    @Post("create/city")
    async createCity(
        @Body() cityDto: CityDto,
        @UploadedFile(UploadFilePipe()) image: Express.Multer.File
    ): Promise<CityOutputDto> {
        cityDto.image = `/uploads/${image.filename}`;
        return new CityOutputDto(
            (await this.locationService.registerCity(
                cityDto
            )) as unknown as CityOutputDto
        );
    }

    @UseGuards(AuthGuard)
    @UseInterceptors(
        ClassSerializerInterceptor,
        FileInterceptor("image", { storage: UploadStorage })
    )
    @Post("create/country")
    async createCountry(
        @Body() countryDto: CountryDto,
        @UploadedFile(UploadFilePipe()) image: Express.Multer.File
    ): Promise<CountryOutputDto> {
        countryDto.image = `/uploads/${image.filename}`;
        return new CountryOutputDto(
            (await this.locationService.registerCountry(
                countryDto
            )) as unknown as CountryOutputDto
        );
    }

    @UseGuards(AuthGuard)
    @UseInterceptors(
        ClassSerializerInterceptor,
        FileInterceptor("image", { storage: UploadStorage })
    )
    @Put("country/:id")
    async updateCountry(
        @Param("id") id: string,
        @Body() countryDto: CountryDto,
        @UploadedFile(UploadFilePipe(false)) image?: Express.Multer.File
    ): Promise<CountryOutputDto> {
        if (image) {
            // TODO: Remove OLD Image
            const newImage = `/uploads/${image.filename}`;
            countryDto.image = newImage;
        }
        return new CountryOutputDto(
            (await this.locationService.updateCountry(
                id,
                countryDto
            )) as unknown as CountryOutputDto
        );
    }

    @UseGuards(AuthGuard)
    @UseInterceptors(
        ClassSerializerInterceptor,
        FileInterceptor("image", { storage: UploadStorage })
    )
    @Put("city")
    async updateCity(
        @Body() cityDto: CityDto,
        @UploadedFile(UploadFilePipe(false)) image?: Express.Multer.File
    ): Promise<CityOutputDto> {
        if (image) {
            // TODO: Remove old Image
            const newImage = `/uploads/${image.filename}`;
            cityDto.image = newImage;
        }

        return new CityOutputDto(
            (await this.locationService.updateCity(
                cityDto
            )) as unknown as CityOutputDto
        );
    }

    @UseGuards(AuthGuard)
    @Delete("city/:country/:name")
    async deleteCity(
        @Param("country") country: string,
        @Param("name") name: string
    ) {
        const result = await this.locationService.deleteCity(country, name);
        return !!result;
    }

    @UseGuards(AuthGuard)
    @Delete("country/:id")
    async deleteCountry(@Param("id") id: string) {
        const result = await this.locationService.deleteCountry(id);
        return !!result;
    }
}
