export const getInitials = (name: string) => {
    if (!name) return '??';
    const names = name.split(' ');
    // Take first letter of the first two names, or just the first letter if only one name
    return names.length > 1 
        ? `${names[0][0]}${names[1][0]}`.toUpperCase() 
        : names[0].slice(0, 2).toUpperCase();
};