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
import mimetypes from "mime-types";
import { CityNotFoundException } from "src/excepetions/CityNotFound.excp";
import { CountryNotFoundException } from "src/excepetions/CountryNotFound.excp";
import { AuthGuard } from "src/shared/auth.guard";
import { UploadStorage } from "src/shared/images.storage";
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

        return list.map((x) => new CityOutputDto(x));
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

        return list.map((x) => new CountryOutputDto(x));
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get("city")
    async getAllCity(): Promise<CityOutputDto[]> {
        const list = await this.locationService.getAllCity();
        return list.map((x) => new CityOutputDto(x));
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get("country")
    async getAllCountry(): Promise<CountryOutputDto[]> {
        const list = await this.locationService.getAllCountry();
        return list.map((x) => new CountryOutputDto(x));
    }

    @UseGuards(AuthGuard)
    @UseInterceptors(
        ClassSerializerInterceptor,
        FileInterceptor("image", { storage: UploadStorage })
    )
    @Post("create/city")
    async createCity(
        @Body() cityDto: CityDto,
        @UploadedFile() image: Express.Multer.File
    ): Promise<CityOutputDto> {
        cityDto.image = `${image.filename}.${mimetypes.extension(
            image.mimetype
        )}`;
        return new CityOutputDto(
            await this.locationService.registerCity(cityDto)
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
        @UploadedFile() image: Express.Multer.File
    ): Promise<CountryOutputDto> {
        countryDto.image = `${image.filename}.${mimetypes.extension(
            image.mimetype
        )}`;
        return new CountryOutputDto(
            await this.locationService.registerCountry(countryDto)
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
        @UploadedFile() image: Express.Multer.File
    ): Promise<CountryOutputDto> {
        const newImage = `${image.filename}.${mimetypes.extension(
            image.mimetype
        )}`;
        countryDto.image = newImage;
        return new CountryOutputDto(
            await this.locationService.updateCountry(id, countryDto)
        );
    }

    @UseGuards(AuthGuard)
    @UseInterceptors(
        ClassSerializerInterceptor,
        FileInterceptor("image", { storage: UploadStorage })
    )
    @Put("city/:id")
    async updateCity(
        @Param("id") id: string,
        @Body() cityDto: CityDto,
        @UploadedFile() image: Express.Multer.File
    ): Promise<CityOutputDto> {
        const newImage = `${image.filename}.${mimetypes.extension(
            image.mimetype
        )}`;
        cityDto.image = newImage;
        return new CityOutputDto(
            await this.locationService.updateCity(id, cityDto)
        );
    }

    @UseGuards(AuthGuard)
    @Delete("city/:id")
    async deleteCity(@Param("id") id: string) {
        const result = await this.locationService.deleteCity(id);
        return !!result;
    }

    @UseGuards(AuthGuard)
    @Delete("country/:id")
    async deleteCountry(@Param("id") id: string) {
        const result = await this.locationService.deleteCountry(id);
        return !!result;
    }
}
