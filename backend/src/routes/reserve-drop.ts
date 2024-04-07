import { Application } from 'express';
import {
  AirdropStatus,
  AuthorizationErrorCode,
  RouteErrorCode,
  SerializedStrategy,
} from '../config/values';
import { NextFunction, Request, Response } from '../http';
import { PoapDrop } from '../models/poap-drop';
import { ResourceError, ValidationError } from '../lib/errors';
import { DropReservation } from '../models/drop-reservation';
import {
  generateEmailAirdropToken,
  readDropReservationToken,
} from '../lib/jwt';
import { SmtpSendTemplate } from '../lib/node-mailer';
import { env } from '../config/env';

/**
 * Installs new route on the provided application.
 * @param app ExpressJS application.
 */
export function inject(app: Application) {
  app.post(
    '/poap-drops/:id/reserve-drop',
    (req: Request, res: Response, next: NextFunction) => {
      resolve(req, res).catch(next);
    },
  );
}

export async function resolve(req: Request, res: Response): Promise<void> {
  const { context, params, body } = req;
  //validate token
  const token = body.token;
  const jwtData = readDropReservationToken(token);
  if (!jwtData) {
    throw new ResourceError(AuthorizationErrorCode.INVALID_TOKEN);
  }

  //Check poap drop
  const poapDrop = await new PoapDrop({}, { context }).populateById(+params.id);
  if (!poapDrop.exists()) {
    throw new ResourceError(RouteErrorCode.POAP_DROP_DOES_NOT_EXISTS);
  }

  //check if reservation for that email already exists
  let dropReservation = await new DropReservation(
    {},
    { context },
  ).populateByDropAndEmail(poapDrop.id, body.email);

  if (dropReservation.exists()) {
    throw new ResourceError(RouteErrorCode.DROP_ALREADY_RESERVED);
  }

  dropReservation = new DropReservation(
    {
      ...body,
      poapDrop_id: poapDrop.id,
    },
    { context },
  );
  await dropReservation.validateAndCreate();

  const emailAirdropToken = await generateEmailAirdropToken(
    dropReservation.email,
    dropReservation.poapDrop_id,
  );

  try {
    //Send email
    await SmtpSendTemplate(
      [dropReservation.email],
      'Claim your proof of attendance NFT',
      'en-airdrop-claim',
      {
        link: `${env.APP_URL}/claim?token=${emailAirdropToken}`,
      },
    );

    dropReservation.airdropStatus = AirdropStatus.EMAIL_SENT;
    await dropReservation.update();
  } catch (err) {
    console.error('Error sending mail and updating drop reservation', err);
    dropReservation.airdropStatus = AirdropStatus.EMAIL_ERROR;
    await dropReservation.update();
  }

  return res.respond(200, dropReservation.serialize(SerializedStrategy.ADMIN));
}
