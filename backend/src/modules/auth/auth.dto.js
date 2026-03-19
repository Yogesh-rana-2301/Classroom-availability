export function toAuthSessionDto({ user, accessToken }) {
  return {
    user,
    accessToken,
  };
}

export function toAuthMessageDto(message) {
  return { message };
}

export function toCurrentUserDto(user) {
  return { user: user || null };
}
