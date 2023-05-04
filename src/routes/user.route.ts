import { Request, Response, Router } from "express";
import UserService from "../services/user.service";
import { authMiddleware } from "../middleware/auth.middleware";
import { permissionMiddleware } from "../middleware/permission.middleware";

const router = Router();

router.get(
  "/",
  permissionMiddleware(["ADM"]),
  async (req: Request, res: Response) => {
    const users = await UserService.getAll();
    if (!users) {
      return res
        .status(404)
        .send({ message: "Não encontramos usuários cadastrados!" });
    }
    res.status(200).send(users);
  }
);
router.get("/:id", authMiddleware, async (req: Request, res: Response) => {
  const user = await UserService.getById(req.params.id);

  if (!user) {
    return res.status(404).send({ message: "Usuário não encontrado!" });
  }
  res.status(200).send(user);
});
router.post("/", async (req: Request, res: Response) => {
  try {
    await UserService.createUser(req.body);
    res.status(201).send({ message: "Usuário criado com sucesso!" });
  } catch (error: any) {
    res.status(400).send({
      message: error.message,
    });
  }
});

router.put(
  "/:id",
  permissionMiddleware(["ADM"]),
  async (req: Request, res: Response) => {
    try {
      const user = await UserService.getById(req.params.id);
      if (!user) {
        return res.status(404).send({ message: "Usuário não encontrado!" });
      }
      await UserService.updateUser(req.params.id, req.body);
      res.status(200).send({ message: "Usuário atualizado com sucesso!" });
    } catch {
      res.status(400).send({
        messsage: "Aconteceu algo, favor verificar as informações enviadas.",
      });
    }
  }
);
router.delete(
  "/:id",
  permissionMiddleware(["ADM"]),
  async (req: Request, res: Response) => {
    try {
      const user = await UserService.getById(req.params.id);
      if (!user) {
        return res.status(404).send({ message: "Usuário não encontrado!" });
      }
      await UserService.deleteUser(req.params.id);
      res.status(200).send({ message: "Usuário excluído com sucesso!" });
    } catch {
      res.status(400).send({
        message: "Aconteceu algo, favor verificar as informações enviadas.",
      });
    }
  }
);

export default router;
