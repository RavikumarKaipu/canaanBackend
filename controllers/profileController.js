import prisma from '../prismaClient.js';
export const saveProfile = async (req, res) => {
    try {
        const { userId, fullName, phone, address, petName, breed, birthday, gender, spayed, weight, photo, color, favFood, favActivity, } = req.body;
        const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
        if (!user)
            return res.status(404).json({ error: "User not found" });
        // upsert profile
        const profile = await prisma.profile.upsert({
            where: { userId: user.id },
            update: { fullName, phone, address },
            create: { userId: user.id, fullName, phone, address },
        });
        // create pet (or update if petId is passed)
        let pet = await prisma.pet.create({
            data: {
                userId: user.id,
                name: petName,
                breed,
                birthday: birthday ? new Date(birthday) : null,
                gender,
                spayed,
                weight,
                photo,
                color,
                favFood,
                favActivity,
            },
        });
        res.json({
            message: "Profile saved successfully",
            user: { ...user, profile, pets: [pet] },
        });
    }
    catch (error) {
        console.error("saveProfile error:", error);
        res.status(500).json({ error: error.message });
    }
};
// UPDATE SPECIFIC SECTION
export const updateProfileSection = async (req, res) => {
    try {
        const { email, section, data, petId } = req.body;
        const user = await prisma.user.findUnique({
            where: { email },
            include: { profile: true, pets: true },
        });
        if (!user)
            return res.status(404).json({ error: "User not found" });
        let updated;
        if (section === "user") {
            const { fullName, phone, address, email: newEmail } = data;
            updated = await prisma.profile.upsert({
                where: { userId: user.id },
                update: { fullName, phone, address },
                create: { userId: user.id, fullName, phone, address },
            });
            if (newEmail && newEmail !== user.email) {
                await prisma.user.update({ where: { id: user.id }, data: { email: newEmail } });
            }
        }
        else if (section === "pet") {
            if (!petId)
                return res.status(400).json({ error: "petId is required" });
            updated = await prisma.pet.update({
                where: { id: Number(petId) },
                data,
            });
        }
        res.json({ message: "Updated successfully", updated });
    }
    catch (error) {
        console.error("updateProfileSection error:", error);
        res.status(500).json({ error: error.message });
    }
};
// GET PROFILE
export const getProfileById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id)
            return res.status(400).json({ error: "User ID is required" });
        const user = await prisma.user.findUnique({
            where: { id: Number(id) },
            include: { profile: true, pets: true },
        });
        if (!user)
            return res.status(404).json({ error: "User not found" });
        res.json({ user });
    }
    catch (err) {
        console.error("getProfileById error:", err);
        res.status(500).json({ error: err.message });
    }
};
//# sourceMappingURL=profileController.js.map