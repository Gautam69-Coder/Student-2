export const isVesEmail = (email) => {
    if (!email) return false;
    const domain = email.split('@')[1]?.toLowerCase();
    return domain === 'ves.ac.in' || domain === 'ves.edu.in' || domain === 'vesit.edu.in';
};

export const canAccessPracticals = (user) => {
    if (!user) return false;
    if (user.role === 'admin' || user.role === 'superadmin') return true;
    return isVesEmail(user.email);
};
