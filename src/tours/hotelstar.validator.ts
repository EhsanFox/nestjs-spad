import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from "class-validator";

const maximumStar = 5;
const minimumStar = 1;
const decoratorName = "IsHotelStar";

export function IsHotelStar(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: decoratorName,
            async: false,
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: IsHotelStarConstraint,
        });
    };
}

@ValidatorConstraint({ name: decoratorName, async: false })
export class IsHotelStarConstraint implements ValidatorConstraintInterface {
    validate(value: number): boolean | Promise<boolean> {
        return value <= maximumStar && value >= minimumStar;
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return `${validationArguments.property} is not a valid star number.`;
    }
}
