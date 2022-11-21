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
    ParseFilePipeBuilder,
} from "@nestjs/common";
import {
    FileFieldsInterceptor,
    FileInterceptor,
} from "@nestjs/platform-express";
import mimetypes from "mime-types";
import { TourNotFoundException } from "src/excepetions/TourNotFound.excp";
import { CityOutputDto } from "src/location/dto/cityOutput.dto";
import { LocationService } from "src/location/locations.service";
import { AuthGuard } from "src/shared/auth.guard";
import { UploadStorage } from "src/shared/images.storage";
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
        return list.map((x) => new CityOutputDto(x));
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get("country/:country")
    async countryTours(
        @Param("country") country: string,
        @Query("english") isEnglishName = true
    ): Promise<TourOutputDto[]> {
        const tours = await this.tourService.getCountryTours(
            country,
            !isEnglishName
        );
        return tours.map(
            (x) => new TourOutputDto(x as unknown as Partial<TourOutputDto>)
        );
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get("city/:city")
    async cityTours(
        @Param("city") city: string,
        @Query("english") isEnglishName = true
    ): Promise<TourOutputDto[]> {
        const tours = await this.tourService.getCityTours(city, !isEnglishName);
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
        @UploadedFiles(
            new ParseFilePipeBuilder()
                .addFileTypeValidator({
                    fileType: /(jpg|jpeg|png|gif)/,
                })
                .build({ fileIsRequired: true })
        )
        images: Express.Multer.File[],
        @Body() tourDto: TourDto
    ): Promise<TourOutputDto> {
        const imageUrls = images.map(
            (x) => `${x.filename}.${mimetypes.extension(x.mimetype)}`
        );
        tourDto.images = imageUrls;
        return new TourOutputDto(
            (await this.tourService.updateTour(
                tourId,
                tourDto as unknown as TourDto
            )) as unknown as Partial<TourOutputDto>
        );
    }

    @UseGuards(AuthGuard)
    @UseInterceptors(
        FileFieldsInterceptor([{ name: "images" }], { storage: UploadStorage })
    )
    @Post("tour/create")
    async createNewTour(
        @UploadedFiles(
            new ParseFilePipeBuilder()
                .addFileTypeValidator({
                    fileType: /(jpg|jpeg|png|gif)/,
                })
                .build({ fileIsRequired: true })
        )
        images: Express.Multer.File[],
        @Body() tourDto: TourDto
    ) {
        const imageUrls = images.map(
            (x) => `${x.filename}.${mimetypes.extension(x.mimetype)}`
        );
        tourDto.images = imageUrls;
        const result = await this.tourService.registerTour(tourDto);
        return new TourOutputDto(result as unknown as Partial<TourOutputDto>);
    }

    @Post("upload-single")
    @UseInterceptors(
        FileInterceptor("image", {
            storage: UploadStorage,
        })
    )
    async uploadSingleFile(@UploadedFile() image: Express.Multer.File) {
        console.log("image", image);
        return true;
    }
}
