export const JITSI_DOMAIN = "8x8.vc";

export const JITSI_CONFIG = {
  // ── Kill the prejoin screen completely ───────────────────
  prejoinPageEnabled: false,
  prejoinConfig: { enabled: false },

  // ── Kill lobby ───────────────────────────────────────────
  lobby: { autoKnock: false, enableChat: false },
  enableLobbyChat: false,

  // ── Hide all toolbar buttons (we use our own) ────────────
  toolbarButtons: [],
  customToolbarButtons: [],

  // ── Hide branding / misc chrome ─────────────────────────
  hideLogo: true,
  hideConferenceTimer: true,
  hideConferenceSubject: true,
  hideParticipantsStats: true,
  disableInviteFunctions: true,
  disableDeepLinking: true,
  enableWelcomePage: false,
  notifications: [],

  // ── Video quality / behaviour ────────────────────────────
  disableLocalVideoFlip: false,
  disableSelfView: false,
};

export const JITSI_INTERFACE_CONFIG = {
  SHOW_JITSI_WATERMARK: false,
  SHOW_WATERMARK_FOR_GUESTS: false,
  SHOW_BRAND_WATERMARK: false,
  SHOW_POWERED_BY: false,
  SHOW_PROMOTIONAL_CLOSE_PAGE: false,
  TOOLBAR_BUTTONS: [],
  DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
  FILM_STRIP_MAX_HEIGHT: 120,
  VERTICAL_FILMSTRIP: true,
  CLOSE_PAGE_GUEST_HINT: false,
  MOBILE_APP_PROMO: false,
  HIDE_INVITE_MORE_HEADER: true,
};
