export interface AuditParametersType {
    uuid: string;
    name: string;
    location: string;
    browser: string;
    networkShape: string;
    configurationId: string;
}

export interface ApiAuditParametersType {
    uuid: string;
    name: string;
    location: string;
    location_label: string;
    browser: string;
    network_shape: string;
    configuration_uuid: string;
}

export const availableNetworkShape = [
    { label: "Cable", value: "CABLE" },
    { label: "DSL", value: "DSL" },
    { label: "3GSlow", value: "THREE_G_SLOW" },
    { label: "3G", value: "THREE_G" },
    { label: "3GFast", value: "THREE_G_FAST" },
    { label: "4G", value: "FOUR_G" },
    { label: "LTE", value: "LTE" },
    { label: "Edge", value: "EDGE" },
    { label: "2G", value: "TWO_G" },
    { label: "Dial", value: "DIAL" },
    { label: "FIOS", value: "FIOS" },
    { label: "Native", value: "NATIVE" },
    { label: "custom", value: "CUSTOM" },
  ];
