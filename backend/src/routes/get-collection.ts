import { Application } from "express";
import {
  PopulateStrategy,
  RouteErrorCode,
  SerializedStrategy,
} from "../config/values";
import { NextFunction, Request, Response } from "../http";
import { PoapDrop } from "../models/poap-drop";
import { ResourceError } from "../lib/errors";
import { CollectionStatus, ICollectionFilters, Nft } from "@apillon/sdk";
import { env } from "../config/env";

/**
 * Installs new route on the provided application.
 * @param app ExpressJS application.
 */
export function inject(app: Application) {
  app.get(
    "/nft-collections",
    (req: Request, res: Response, next: NextFunction) => {
      resolve(req, res).catch(next);
    }
  );

  app.get(
    "/nft-collections/:collectionUuid",
    (req: Request, res: Response, next: NextFunction) => {
      resolve(req, res).catch(next);
    }
  );
}

export async function resolve(req: Request, res: Response): Promise<void> {
  const { context, params, query } = req;

  const nft = new Nft({
    key: env.APILLON_KEY,
    secret: env.APILLON_SECRET,
  });

  if (params.collectionUuid) {
    return res.respond(200, await nft.collection(params.collectionUuid).get());
  } else {
    const filter: ICollectionFilters = {};

    const collections = await nft.listCollections(filter);

    return res.respond(200, collections);
  }
}
