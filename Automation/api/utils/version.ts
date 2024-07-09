import { z } from "zod";
export type VersionString = `${number}.${number}.${number}` | `${number}.${number}.${number}.${number}`;
export type VersionTuple = [number, number, number, number?];

const g1 = "(?<major>0|[1-9]\\d*)";
const g2 = "(?<minor>0|[1-9]\\d*)";
const g3 = "(?<patch>0|[1-9]\\d*)";
const g4 = "(?<build>0|[1-9]\\d*)";

export const versionRegex = new RegExp(`^${g1}\\.${g2}\\.${g3}(?:\\.${g4})?$`, "m");

const versionSchemaBase = z.string().regex(versionRegex);

export const versionStringSchema = versionSchemaBase.transform(str => <VersionString>str);
export const versionTuple = versionSchemaBase.transform(str => <VersionTuple>str.split(".").map(p => parseInt(p, 10)));
export const versionSchema = versionSchemaBase.transform(str => Version.fromString(str as VersionString));

export class Version {
    constructor(
        public readonly major: number,
        public readonly minor: number,
        public readonly patch: number
    ) {}

    bumpPatch(): Version {
        return new Version(this.major, this.minor, this.patch + 1);
    }

    bumpMinor(): Version {
        return new Version(this.major, this.minor + 1, 0);
    }

    bumpMajor(): Version {
        return new Version(this.major, this.minor + 1, 0);
    }

    format(): string {
        return `${this.major}.${this.minor}.${this.patch}`;
    }

    equals(anotherVersion: Version): boolean {
        return (
            this.major === anotherVersion.major &&
            this.minor === anotherVersion.minor &&
            this.patch === anotherVersion.patch
        );
    }

    toTuple(): VersionTuple {
        return [this.major, this.minor, this.patch];
    }

    static fromParts(major: number, minor: number, patch: number): Version {
        return new Version(major, minor, patch);
    }

    static fromString(version: string): Version {
        const [major, minor, patch, build] = versionTuple.parse(version);
        return new Version(major, minor, patch);
    }
}
