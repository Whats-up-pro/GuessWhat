// Personalize the entire card here.
export const CARD_CONFIG = {
  recipient: 'Someone Special',
  nickname: 'my favorite human',
  birthday: 'Your special day',
  ageLine: 'thêm một tuổi mới thật xinh',
  wish:
    'Chúc bạn một tuổi mới dịu dàng như nắng sớm, rực rỡ như những điều bạn mơ và luôn được bao quanh bởi thật nhiều yêu thương.',
  secretMessage:
    'Cảm ơn vì đã xuất hiện và làm cho thế giới quanh bạn trở nên ấm áp hơn. Mong mọi điều tử tế nhất sẽ tìm được đường đến với bạn.',
  musicTitle: 'Golden little moments',
  musicUrl: '',
  images: [
    'temp_images/photo_10_matcha_flowers.jpg',
    'temp_images/photo_5_lavender_garden.jpg',
    'temp_images/photo_2_beach_sunset.png',
  ],
};

const CONFIG_DEFAULTS = Object.freeze({
  recipient: 'Someone Special',
  nickname: 'my favorite human',
  birthday: 'Your special day',
  ageLine: 'thêm một tuổi mới thật xinh',
  wish: 'Chúc bạn luôn gặp những điều dịu dàng và rực rỡ nhất.',
  secretMessage: 'Bạn xứng đáng với thật nhiều niềm vui và yêu thương.',
  musicTitle: 'Golden little moments',
  musicUrl: '',
  images: [],
});

export function safeImageList(images) {
  const cleanImages = Array.isArray(images)
    ? images.filter((source) => typeof source === 'string').map((source) => source.trim()).filter(Boolean)
    : [];

  return cleanImages.length ? cleanImages : [''];
}

export function normalizeCardConfig(config = {}) {
  const safeConfig = config && typeof config === 'object' ? config : {};
  const normalized = { ...CONFIG_DEFAULTS, ...safeConfig };

  return {
    ...normalized,
    recipient: String(normalized.recipient || CONFIG_DEFAULTS.recipient).trim(),
    nickname: String(normalized.nickname || CONFIG_DEFAULTS.nickname).trim(),
    birthday: String(normalized.birthday || CONFIG_DEFAULTS.birthday).trim(),
    ageLine: String(normalized.ageLine || CONFIG_DEFAULTS.ageLine).trim(),
    wish: String(normalized.wish || CONFIG_DEFAULTS.wish).trim(),
    secretMessage: String(normalized.secretMessage || CONFIG_DEFAULTS.secretMessage).trim(),
    musicTitle: String(normalized.musicTitle || CONFIG_DEFAULTS.musicTitle).trim(),
    musicUrl: String(normalized.musicUrl || '').trim(),
    images: safeImageList(normalized.images),
  };
}
