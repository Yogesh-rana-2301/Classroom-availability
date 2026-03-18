export function getCurrentUser(state) {
  return state.user;
}

export function getCurrentRole(state) {
  return state.user?.role;
}
