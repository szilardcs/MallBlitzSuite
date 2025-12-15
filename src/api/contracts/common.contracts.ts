import { z } from "zod";

export const Identifier = z.string().min(1);
export const IsoDateTime = z.string().datetime();
export const PositiveInt = z.number().int().nonnegative();
export const NonEmptyString = z.string().min(1);
