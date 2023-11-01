import api from "../api/axiosConfig";
import { MachineSettings } from "../types";

const MACHINE_SETTINGS_BASE_URL = "/settings";

class MachineSettingsService {
  getMachineSettings() {
    return api.get<MachineSettings>(
      `${MACHINE_SETTINGS_BASE_URL}/machine_settings`
    );
  }

  updateMachineSettings(settings: MachineSettings) {
    return api.put<MachineSettings>(MACHINE_SETTINGS_BASE_URL, settings);
  }

  updateMachineSettingsWithKey(settings: MachineSettings) {
    return api.put<MachineSettings>(
      `${MACHINE_SETTINGS_BASE_URL}/machine_settings`,
      settings
    );
  }
}

export default new MachineSettingsService();
