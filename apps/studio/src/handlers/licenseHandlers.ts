import { OfflineLicense } from "@/backend/lib/OfflineLicense";
import { LicenseKey } from "@/common/appdb/models/LicenseKey";
import { TransportLicenseKey } from "@/common/transport";
import { LicenseStatus } from "@/lib/license";
import { InstallationId } from "@/common/appdb/models/installation_id";

export interface ILicenseHandlers {
  "license/createTrialLicense": () => Promise<void>;
  "license/getStatus": () => Promise<LicenseStatus>;
  "license/get": () => Promise<TransportLicenseKey[]>;
  "license/remove": (({ id }: { id: number }) => Promise<void>);
  "license/wipe": () => Promise<void>;
  "license/getInstallationId": () => Promise<string>;
}

export const LicenseHandlers: ILicenseHandlers = {
  "license/createTrialLicense": async function () {
    await LicenseKey.createTrialLicense();
  },
  "license/remove": async function ({ id }) {
    const key = await LicenseKey.findOneBy({ id })
    if (key) {
      await key.remove()
    }
  },
  "license/getStatus": async function () {
    // DEVELOPMENT BYPASS: Check dev-config.json file
    try {
      const fs = require('fs');
      const path = require('path');

      // Try multiple possible locations for dev-config.json
      const configPaths = [
        path.join(process.cwd(), 'dev-config.json'),
        path.resolve(__dirname, '../../../../dev-config.json'),
        path.resolve(__dirname, '../../../../../dev-config.json'),
        '/Users/jean/development/beekeeper-studio/dev-config.json'
      ];

      let config = null;
      for (const configPath of configPaths) {
        if (fs.existsSync(configPath)) {
          const configData = fs.readFileSync(configPath, 'utf8');
          config = JSON.parse(configData);
          break;
        }
      }

      if (config && config.license && config.license.bypass === true) {
        const edition = config.license.edition || 'ultimate';
        const status = new LicenseStatus();
        status.edition = edition as "community" | "ultimate";
        status.condition = ["Development bypass enabled via dev-config.json"];
        status.fromFile = false;

        const fakeLicense: TransportLicenseKey = {
          id: 0,
          email: "dev@localhost",
          key: "DEV-LICENSE-BYPASS",
          validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          supportUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          licenseType: "BusinessLicense",
          maxAllowedAppRelease: null as any,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          version: 1
        };
        status.license = fakeLicense;

        return {
          ...status,
          isUltimate: status.isUltimate,
          isCommunity: status.isCommunity,
          isTrial: status.isTrial,
          isValidDateExpired: status.isValidDateExpired,
          isSupportDateExpired: status.isSupportDateExpired,
          maxAllowedVersion: status.maxAllowedVersion,
        };
      }
    } catch (error) {
      // Silent fail - use normal flow if dev-config.json doesn't exist or is invalid
    }

    // Normal flow: Check file-based license first
    const offline = OfflineLicense.load()
    let status = null
    if (offline && offline.isValid) {
      status = offline.toLicenseStatus()
    } else {
      status = await LicenseKey.getLicenseStatus();
    }
    return {
      ...status,
      isUltimate: status.isUltimate,
      isCommunity: status.isCommunity,
      isTrial: status.isTrial,
      isValidDateExpired: status.isValidDateExpired,
      isSupportDateExpired: status.isSupportDateExpired,
      maxAllowedVersion: status.maxAllowedVersion,
    };
  },
  "license/get": async function () {
    const offline = OfflineLicense.load()
    if (offline) {
      const licenseKey = offline.toLicenseKey();
      if (licenseKey) return [licenseKey];
    }
    return await LicenseKey.find();
  },
  "license/wipe": async function () {
    await LicenseKey.wipe();
  },
  "license/getInstallationId": async function () {
    // Make sure we return a string, not null
    const id = await InstallationId.get();
    return id || "";
  }
};
