const IDLE_THRESHOLD_PRESETS = [1, 3, 5, 10, 15];

const MEETING_OWNER_PATTERNS = [
  /zoom/i,
  /teams/i,
  /webex/i,
  /cpt\.?host/i,
  /microsoft teams/i
];

const MEET_TITLE_PATTERN = /\bmeet\b/i;

function normalizeSmart(input) {
  const defaults = {
    idleEnabled: false,
    idleThresholdMinutes: 3,
    meetingEnabled: false,
    presentationMode: false
  };

  const next = { ...defaults, ...(input || {}) };
  const preset = IDLE_THRESHOLD_PRESETS.includes(next.idleThresholdMinutes)
    ? next.idleThresholdMinutes
    : defaults.idleThresholdMinutes;

  return {
    idleEnabled: Boolean(next.idleEnabled),
    idleThresholdMinutes: preset,
    meetingEnabled: Boolean(next.meetingEnabled),
    presentationMode: Boolean(next.presentationMode)
  };
}

function normalizeHotkey(input) {
  const defaults = {
    enabled: false,
    accelerator: "CommandOrControl+Shift+M"
  };

  const next = { ...defaults, ...(input || {}) };
  const accelerator =
    typeof next.accelerator === "string" && next.accelerator.trim()
      ? next.accelerator.trim()
      : defaults.accelerator;

  return {
    enabled: Boolean(next.enabled),
    accelerator
  };
}

function isUserIdle(idleSeconds, thresholdMinutes) {
  return idleSeconds >= thresholdMinutes * 60;
}

function isMeetingForeground(activeWindow) {
  if (!activeWindow) {
    return false;
  }

  const ownerName = activeWindow.owner?.name || "";
  const ownerPath = activeWindow.owner?.path || "";
  const title = activeWindow.title || "";
  const ownerHaystack = `${ownerName} ${ownerPath}`;

  if (MEETING_OWNER_PATTERNS.some(pattern => pattern.test(ownerHaystack))) {
    return true;
  }

  if (MEET_TITLE_PATTERN.test(title) && /google|chrome|firefox|edge|brave/i.test(ownerHaystack + title)) {
    return true;
  }

  return false;
}

function evaluatePauseReason({ smartConfig, idleSeconds, meetingDetected }) {
  if (smartConfig.presentationMode) {
    return "presentation";
  }

  if (smartConfig.meetingEnabled && meetingDetected) {
    return "meeting";
  }

  if (
    smartConfig.idleEnabled &&
    !isUserIdle(idleSeconds, smartConfig.idleThresholdMinutes)
  ) {
    return "idle";
  }

  return null;
}

function getIdleRemainingSeconds(idleSeconds, thresholdMinutes) {
  const thresholdSeconds = thresholdMinutes * 60;
  return Math.max(0, thresholdSeconds - idleSeconds);
}

module.exports = {
  IDLE_THRESHOLD_PRESETS,
  normalizeSmart,
  normalizeHotkey,
  isUserIdle,
  isMeetingForeground,
  evaluatePauseReason,
  getIdleRemainingSeconds
};
