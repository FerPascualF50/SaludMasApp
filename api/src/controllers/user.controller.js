import mongoose from "mongoose";
import { getAllUsersService, getUserByIdService, updateUserService, deleteUserService, updatePassService, updateRolService, createUsersToAdminsService, patchPlanOnUserService } from "../services/user.service.js";
import { hasEmptyField, hasAllFields, hasStringValue, hasPassFormat, hasOnlyLetters } from "../utils/validation.js";
import { fieldsByController } from "../utils/fieldsByController.js"

export const updateUserControler = async (req, res) => {
  try {
    // const id = req.user.rol === 'admin' ? req.params.id : req.user.id;
    const { _id, firstName, lastName, cellphone, address, taxId, plan } = req.body;
    const id = _id
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('El ID del ususario proporcionado no tiene el formato válido');
    if (!mongoose.Types.ObjectId.isValid(plan._id)) throw new Error('El ID del plan proporcionado no tiene el formato válido');
    if (hasEmptyField(id, firstName, lastName, address, plan._id, cellphone)) throw new Error('Falta uno o más campos requeridos');
    if (!hasOnlyLetters({firstName, lastName})) throw new Error('Nomnbre, apelldo y dirección deben ser solo letras y no estar vacío');
    // if (hasStringValue({cellphone, taxId}))  throw new Error('El campo celular y CUIT deben ser numeros');
    if (cellphone.toString().length != 10 || taxId.toString().length != 11) throw new Error('El campo celular o CUIT no tienen la logitud correcta');
    // if (!hasAllFields(req.body, fieldsByController.updateEngageUserControler)) throw new Error('Ups... algo falló');
    const user = {firstName, lastName, cellphone, address, taxId, plan: plan._id}
    const updateUserToClient = await updateUserService(id, user );
    return res.status(201).send({ success: true, response: updateUserToClient, message: "Usuario actualizado correctamente" });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};
export const getUserByIdController = async (req, res) => {
  try {
    const { id } = req.params ;
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('El ID proporcionado no tiene el formato válido');
    const user = await getUserByIdService(id);
    return res.status(200).send({ success: true, response: user });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

export const getAllUsersController = async (req, res) => {
  const users = await getAllUsersService({});
  return res.status(200).send({ success: true, response: users });
};

export const deleteUserController = async (req, res) => {
  try {
    const id = req.user.rol === 'admin' ? req.params.id : req.user.id;
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('El ID proporcionado no tiene el formato válido');
    const deletedUser = await deleteUserService(id);
    return res.status(201).send({ success: true, response: deletedUser, message: "Usuario eliminado correctamente"});
  } catch (error) {
    res.json({ success: false, error: error.message, message: 'Ups... El usuario no pudo ser eliminado correctamente'});
  }
};

export const updatePassController = async (req, res) => {
  try {
    const { id } = req.user;
    const { oldPass, newPass } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('El ID proporcionado no tiene el formato válido');
    if (!hasAllFields(req.body, fieldsByController.updatePassController)
      || hasEmptyField(req.body, req.user)
      || !hasPassFormat(oldPass)
      || !hasPassFormat(newPass)
    ) throw new Error('Ups... Algunos datos incorrectos');
    const success = await updatePassService(id, oldPass, newPass);
    return res.status(200).json({ success: true, message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

export const updateRolController = async (req, res) => {
  try {
    const { id } = req.user;
    const { userId, rol } = req.body
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('El ID proporcionado no tiene el formato válido');
    if (!mongoose.Types.ObjectId.isValid(userId)) throw new Error('El ID proporcionado no tiene el formato válido');
    if (!hasAllFields(req.body, fieldsByController.updateRolController)
      || hasEmptyField(req.body)
      || rol !== 'admin'
    ) throw new Error('Ups... Algunos datos incorrectos');
    const success = await updateRolService(id, userId, rol)
    res.status(201).json({succsess: true, message: 'Rol actualizado correctamente'})
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

export const createUsersToAdminsController = async (req, res) => {
  try {
    const { userName, password, firstName, lastName, plan, cellphone, address, taxId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(plan)) throw new Error('El ID del plan proporcionado no tiene el formato válido');
    if (hasEmptyField(firstName, lastName, address, cellphone, plan, cellphone, address, taxId)) throw new Error('Falta uno o más campos requeridos');
    if (!hasOnlyLetters({firstName, lastName})) throw new Error('Los datos deben ser solo letras');
    if (hasStringValue({cellphone, taxId}))  throw new Error('El campo celular y CUIT deben ser numeros');
    if (cellphone.toString().length != 10 || taxId.toString().length != 11) throw new Error('El campo celular o CUIT no tienen la logitud correcta');
    if (!hasAllFields(req.body, fieldsByController.createUsersToAdminsController)) throw new Error('Ups... algo falló');
    const userCreated = await createUsersToAdminsService({ userName, password, firstName, lastName, plan, cellphone, address, taxId });
    return res.status(201).json({ success: true, response: userCreated, message: 'Usuario creado con éxito' });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

export const patchPlanOnUserController = async (req, res) => {
  const { id } = req.user;
  const  planId  = req.body._id
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('El ID del usuario proporcionado no tiene el formato válido');
  if (!mongoose.Types.ObjectId.isValid(planId)) throw new Error('El ID del plan proporcionado no tiene el formato válido');
  const newUser = await patchPlanOnUserService(id, planId);
  return res.status(200).send({ success: true, response: newUser });
};