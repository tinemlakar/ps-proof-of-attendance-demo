import { dateParser, integerParser } from "@rawmodel/parsers";
import { presenceValidator } from "@rawmodel/validators";
import {
  PopulateStrategy,
  SerializedStrategy,
  ValidatorErrorCode,
} from "../config/values";
import { stringTrimParser } from "../lib/parsers";
import { BaseSqlModel, prop } from "./base-sql-model";
import { ValidationError } from "../lib/errors";
import { PoolConnection } from "mysql2/promise";
import { getQueryParams, selectAndCountQuery } from "../lib/sql-utils";

export class DropReservation extends BaseSqlModel {
  protected _tableName = "drop_reservation";

  @prop({
    parser: { resolver: integerParser() },
    populatable: [PopulateStrategy.DB, PopulateStrategy.ADMIN],
    serializable: [
      SerializedStrategy.DB,
      SerializedStrategy.PROFILE,
      SerializedStrategy.ADMIN,
    ],
    validators: [
      {
        resolver: presenceValidator(),
        code: ValidatorErrorCode.DROP_RESERVATION_REQUIRED_DATA_NOT_PRESENT,
      },
    ],
  })
  public poap_drop_id: number;

  @prop({
    parser: { resolver: stringTrimParser() },
    populatable: [PopulateStrategy.DB, PopulateStrategy.ADMIN],
    serializable: [
      SerializedStrategy.DB,
      SerializedStrategy.PROFILE,
      SerializedStrategy.ADMIN,
    ],
    validators: [
      {
        resolver: presenceValidator(),
        code: ValidatorErrorCode.DROP_RESERVATION_REQUIRED_DATA_NOT_PRESENT,
      },
    ],
  })
  public email: string;

  public async validateAndCreate(conn?: PoolConnection) {
    try {
      await this.validate();
    } catch (err) {
      await this.handle(err);
    }

    if (!this.isValid()) {
      throw new ValidationError(
        this,
        this.getContext(),
        "DropReservation.create()"
      );
    }

    await this.insert(SerializedStrategy.ADMIN, conn);
  }

  public async validateAndUpdate(conn?: PoolConnection) {
    try {
      await this.validate();
    } catch (err) {
      await this.handle(err);
    }

    if (!this.isValid()) {
      throw new ValidationError(
        this,
        this.getContext(),
        "DropReservation.create()"
      );
    }

    await this.update(SerializedStrategy.UPDATE_DB, { conn });
  }

  /*public async getList(urlQuery) {
    const { params, filters } = getQueryParams(
      { id: null, title: null, status: null },
      "pd",
      {},
      urlQuery
    );
    if (filters.limit === -1) {
      filters.limit = null;
    }

    const sqlQuery = {
      qSelect: `
        SELECT *
        `,
      qFrom: `
        FROM poap_drop pd
        WHERE
          (@id IS NULL OR pd.id = @id)
          AND (@title IS NULL OR pd.title LIKE CONCAT('%', @title, '%'))
          AND (@status IS NULL OR pd.status = @status)
        `,
      qGroup: `
        `,
      qFilter: `
        ORDER BY ${
          filters.orderArr
            ? `${filters.orderArr.join(", ") || "pd.updateTime DESC"}`
            : "pd.updateTime DESC"
        }
        ${
          filters.limit !== null
            ? `LIMIT ${filters.limit} OFFSET ${filters.offset}`
            : ""
        };
      `,
    };

    return await selectAndCountQuery(this.db(), sqlQuery, params, "pd.id");
  }*/
}
