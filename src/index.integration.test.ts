import { expect } from "chai";
import { parseBoolean, parseDate, parseJson, parseNumber, string } from "fefe";

import { parseEnv } from "./index";

describe("integration tests", () => {
  let originalEnv: NodeJS.ProcessEnv;
  beforeEach(() => {
    originalEnv = process.env;
    process.env = { ...process.env };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should return a parsed object with shorthand notation", () => {
    Object.assign(process.env, {
      BOOLEAN_VAR: "true",
      CUSTOM_VAR: "foo,bar",
      DATE_VAR: "2017-11-29T10:11:48.915Z",
      JSON_VAR: '{"foo": 1.337}',
      NUMBER_VAR: "1.337",
      OTHER_VAR: "bar",
      STRING_VAR: "foo",
    });

    interface Config {
      booleanVar: boolean;
      customVar: string[];
      dateVar: Date;
      defaultVar: number;
      jsonVar: any;
      numberVar: number;
      optionalStringVar?: string;
      otherNameVar: string;
      stringVar: string;
    }

    const config: Config = parseEnv({
      booleanVar: parseBoolean(),
      customVar: (value) => value.split(","),
      dateVar: parseDate(),
      defaultVar: { sanitize: parseNumber(), default: 1.337 },
      jsonVar: parseJson(),
      numberVar: parseNumber(),
      optionalStringVar: { sanitize: string(), optional: true },
      otherNameVar: { name: "OTHER_VAR", sanitize: string() },
      stringVar: string(),
    });

    expect(config).to.eql({
      booleanVar: true,
      customVar: ["foo", "bar"],
      dateVar: new Date("2017-11-29T10:11:48.915Z"),
      defaultVar: 1.337,
      jsonVar: { foo: 1.337 },
      numberVar: 1.337,
      optionalStringVar: undefined,
      otherNameVar: "bar",
      stringVar: "foo",
    });
  });

  it("should throw if variable is unset and not optional", () => {
    expect(() => parseEnv({ unsetVar: parseBoolean() })).to.throw(
      "Missing environment variable UNSET_VAR"
    );
  });

  it("should throw if variable cannot be sanitized", () => {
    process.env.BOOLEAN_VAR = "1";
    expect(() => parseEnv({ booleanVar: parseBoolean() })).to.throw(
      "Environment variable BOOLEAN_VAR cannot be sanitized: Not a boolean."
    );
  });
});
