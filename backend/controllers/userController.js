import { db } from "../db.js";

// 🧩 1️⃣ Get all users (with followers & following count)
export const getUsers = async (req, res) => {
  try {
    const users = await db.all(`
      SELECT 
        u.*, 
        (SELECT COUNT(*) FROM followers WHERE following_id = u.id) as followersCount,
        (SELECT COUNT(*) FROM followers WHERE follower_id = u.id) as followingCount
      FROM users u
    `);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🧩 2️⃣ Create a new user
export const createUser = async (req, res) => {
  const { name, email, phone, dob, image_url } = req.body;
  try {
    await db.run(
      "INSERT INTO users (name, email, phone, dob, image_url) VALUES (?, ?, ?, ?, ?)",
      [name, email, phone, dob, image_url]
    );
    res.json({ message: "User added successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 🧩 3️⃣ Update user
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, dob, image_url } = req.body;

  try {
    await db.run(
      "UPDATE users SET name=?, email=?, phone=?, dob=?, image_url=? WHERE id=?",
      [name, email, phone, dob, image_url, id]
    );
    res.json({ message: "User updated successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 🧩 4️⃣ Delete user
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await db.run("DELETE FROM users WHERE id=?", [id]);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🧩 5️⃣ Follow / Unfollow user
export const followUser = async (req, res) => {
  const { follower_id, following_id } = req.body;

  try {
    const alreadyFollowed = await db.get(
      "SELECT * FROM followers WHERE follower_id=? AND following_id=?",
      [follower_id, following_id]
    );

    if (alreadyFollowed) {
      await db.run(
        "DELETE FROM followers WHERE follower_id=? AND following_id=?",
        [follower_id, following_id]
      );
      res.json({ message: "Unfollowed successfully" });
    } else {
      await db.run(
        "INSERT INTO followers (follower_id, following_id) VALUES (?, ?)",
        [follower_id, following_id]
      );
      res.json({ message: "Followed successfully" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
