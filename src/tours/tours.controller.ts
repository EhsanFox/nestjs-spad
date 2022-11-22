import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    UseInterceptors,
    ClassSerializerInterceptor,
    UseGuards,
    UploadedFile,
    UploadedFiles,
} from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import mimetypes from "mime-types";
import { InternalErrorException } from "src/excepetions";
import { CityNotFoundException } from "src/excepetions/CityNotFound.excp";
import { EmptyQueryException } from "src/excepetions/EmptyQuery.excp";
import { TourNotFoundException } from "src/excepetions/TourNotFound.excp";
import { CityOutputDto } from "src/location/dto/cityOutput.dto";
import { LocationService } from "src/location/locations.service";
import { AuthGuard } from "src/shared/auth.guard";
import { UploadStorage } from "src/shared/images.storage";
import { UploadFilePipe } from "src/shared/uploadfile.pipe";
import { TourDto } from "./dto/tour.dto";
import { TourOutputDto } from "./dto/tourOutput.dto";
import { ToursService } from "./tours.service";

@Controller("tours")
export class ToursController {
    constructor(
        private readonly tourService: ToursService,
        private readonly locationService: LocationService
    ) {}

    @Get("popular/tours")
    async popularTours(): Promise<TourOutputDto[]> {
        const list = await this.tourService.getPopularTours();
        return list.map(
            (x) => new TourOutputDto(x as unknown as Partial<TourOutputDto>)
        );
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get("popular/cities")
    async getPopularCities(): Promise<CityOutputDto[]> {
        const list = await this.locationService.getPopularCities();
        const cityList = [];
        for (const country of list) {
            cityList.push(...country.cityList);
        }
        return cityList.map(
            (x) => new CityOutputDto(x as unknown as CityOutputDto)
        );
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get("country")
    async countryTours(
        @Query("name") name?: string,
        @Query("persianName") persianName?: string
    ): Promise<TourOutputDto[]> {
        const country = name ?? persianName;
        const isPersianName = persianName !== undefined ? true : false;
        if (country == undefined) throw new EmptyQueryException();
        const tours = await this.tourService.getCountryTours(
            country,
            isPersianName
        );
        return tours.map(
            (x) => new TourOutputDto(x as unknown as Partial<TourOutputDto>)
        );
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get("city")
    async cityTours(
        @Query("name") name?: string,
        @Query("persianName") persianName?: string
    ): Promise<TourOutputDto[]> {
        const city = name ?? persianName;
        const isPersianName = persianName !== undefined ? true : false;
        if (city == undefined) throw new EmptyQueryException();
        const tours = await this.tourService.getCityTours(city, isPersianName);
        return tours.map(
            (x) => new TourOutputDto(x as unknown as Partial<TourOutputDto>)
        );
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get("tour/:id")
    async getTour(@Param("id") id: string): Promise<TourOutputDto> {
        return new TourOutputDto(
            (await this.tourService.getTour(
                id
            )) as unknown as Partial<TourOutputDto>
        );
    }

    @UseInterceptors(
        ClassSerializerInterceptor,
        FileFieldsInterceptor([{ name: "images" }], { storage: UploadStorage })
    )
    @Post("create/tour")
    async createTour(
        @UploadedFile(UploadFilePipe()) images: Express.Multer.File[],
        @Body() tourDto: TourDto
    ): Promise<TourOutputDto> {
        const imageUrls = images.map((x) => `/uploads/${x.filename}`);
        tourDto.images = imageUrls;
        const result = await this.tourService.registerTour(tourDto);
        if (!result)
            throw new InternalErrorException("Couldn't create a new tour.");
        return new TourOutputDto(result);
    }

    @UseGuards(AuthGuard)
    @Delete("tour/:id")
    async deleteTour(@Param("id") id: string) {
        const tour = await this.tourService.deleteTour(id);
        if (!tour) throw new TourNotFoundException();
        else return true;
    }

    @UseGuards(AuthGuard)
    @UseInterceptors(
        FileFieldsInterceptor([{ name: "images" }], { storage: UploadStorage })
    )
    @Put("tour/:id")
    async updateTour(
        @Param("id") tourId: string,
        @Body() tourDto: TourDto,
        @UploadedFiles(UploadFilePipe(false))
        images?: Express.Multer.File[]
    ): Promise<TourOutputDto> {
        if (images && images.length) {
            const imageUrls = images.map((x) => `/uploads/${x.filename}`);
            tourDto.images = imageUrls;
        }

        return new TourOutputDto(
            (await this.tourService.updateTour(
                tourId,
                tourDto as unknown as TourDto
            )) as unknown as Partial<TourOutputDto>
        );
    }
}
