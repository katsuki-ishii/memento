import { useAuthStore } from '../stores/auth';
import { useProfileStore } from '../stores/profile';

const randomToken = () => Math.random().toString(36).slice(2);

/**
 * Hosted UI への遷移を模擬（実装時は location.href に飛ばす）
 */
export const startHostedLogin = async ({ redirectUrl = '/auth/callback' } = {}) => {
  const state = randomToken();
  const code = randomToken();
  // 実際には state を sessionStorage に保存し、Hosted UI へリダイレクトする
  const url = `${redirectUrl}?code=${code}&state=${state}`;
  return { simulatedRedirect: url, state, code };
};

/**
 * Hosted UI からの戻りを処理するスタブ
 */
export const handleCallback = async ({ code, error } = {}) => {
  if (error) {
    const err = new Error('Authorization failed');
    err.reason = error;
    throw err;
  }
  if (!code) {
    throw new Error('Missing authorization code');
  }

  // 仮のトークンと設定済みフラグ
  const tokens = {
    accessToken: `access-${code}`,
    refreshToken: `refresh-${code}`,
  };

  const auth = useAuthStore();
  const profile = useProfileStore();

  auth.setSession(tokens);
  auth.markSetupComplete(); // デモでは設定済みとする。後で API から判定する
  profile.setProfile({
    username: 'Demo User',
    lifespan: 81,
    weekStart: 'mon',
  });

  return { isSetupComplete: true };
};
