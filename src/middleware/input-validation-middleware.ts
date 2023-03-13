import {ValidationError, validationResult} from "express-validator";
import {NextFunction, Request, Response} from "express";

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errorFormatter = ({msg, param}: ValidationError) => {
        return {
            message: msg,
            field: param
        }
    };
    const errors = validationResult(req).formatWith(errorFormatter)
    req.headers.authorization;
    if (!errors.isEmpty()) {
        res.status(400).send({errorsMessages: errors.array({onlyFirstError: true})})
        return
    }
    next()
}