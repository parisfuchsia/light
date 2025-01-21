export const variant = {
    before: {
        opacity: 0
    },
    after: {
        opacity: 1
    }
};

export const fromTopVariant = {
    before: {
        opacity: 0,
        y: "-30%",
        padding: 0
    },
    after: {
        opacity: 1,
        y: 0,
        padding: "0.75rem",
        transition: {
            duration: 1
        }
    }
};

export const slideVariant = {
    before: { opacity: 0, padding: 0, width: 0, margin:0 },
    after: { opacity: 1, padding: "auto",  width: "auto", margin:"auto" }
};
