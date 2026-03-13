export type RealmConfig = {
    email: string;
    api_key: string;
    url: string;
    nickname: string;
};
let current_realm_config: RealmConfig;

// login_manager should be the only caller for this unless
// we somehow want to support multiple sessions in a single tab.
export function set_current_realm_config(config: RealmConfig) {
    current_realm_config = config;
}

export function get_current_realm_config(): RealmConfig | undefined {
    return current_realm_config;
}

export function get_current_realm_url(): string {
    return current_realm_config!.url;
}

export function get_email_for_current_realm() {
    return current_realm_config?.email;
}

export function get_current_realm_nickname() {
    return current_realm_config?.nickname;
}

export function get_api_key_for_current_realm() {
    return current_realm_config?.api_key;
}
