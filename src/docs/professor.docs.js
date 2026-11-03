/**
 * @openapi
 * components:
 *   schemas:
 *     Professor:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         usuarioId:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             email:
 *               type: string
 *               example: ana@escola.com
 *             tipoUser:
 *               type: string
 *               example: professor
 *         nome:
 *           type: string
 *           example: Ana
 *         sobrenome:
 *           type: string
 *           example: Silva
 *         cpf:
 *           type: string
 *           example: "12345678901"
 *         dataNasc:
 *           type: string
 *           format: date-time
 *         cidade:
 *           type: string
 *           example: Registro
 *         telefone:
 *           type: string
 *           example: "13999999999"
 *         urlFotoProfessor:
 *           type: string
 *           example: https://res.cloudinary.com/exemplo/image/upload/foto.jpg
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     ErroProfessor:
 *       type: object
 *       properties:
 *         erro:
 *           type: string
 *         detalhes:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               campo:
 *                 type: string
 *               mensagem:
 *                 type: string
 */

/**
 * @openapi
 * /professores:
 *   post:
 *     summary: Cadastra um novo professor
 *     description: Registra um professor, cria suas credenciais de acesso e armazena sua foto de perfil no Cloudinary.
 *     tags:
 *       - Professores
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - dadosUsuario
 *               - dadosProfessor
 *               - foto
 *             properties:
 *               dadosUsuario:
 *                 type: string
 *                 description: Objeto JSON serializado contendo e-mail e senha do usuário.
 *                 example: '{"email":"ana@escola.com","senha":"senha123"}'
 *               dadosProfessor:
 *                 type: string
 *                 description: Objeto JSON serializado contendo os dados pessoais do professor.
 *                 example: '{"nome":"Ana","sobrenome":"Silva","cpf":"12345678901","dataNasc":"1995-05-20","cidade":"Registro","telefone":"13999999999"}'
 *               foto:
 *                 type: string
 *                 format: binary
 *                 description: Foto de perfil do professor.
 *
 *     responses:
 *       '201':
 *         description: Professor cadastrado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: Professor cadastrado com sucesso!
 *                 professor:
 *                   $ref: '#/components/schemas/Professor'
 *
 *       '400':
 *         description: Dados inválidos ou foto de perfil não fornecida.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroProfessor'
 *
 *       '409':
 *         description: CPF ou e-mail já cadastrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroProfessor'
 *
 *       '500':
 *         description: Erro interno durante o cadastro.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroProfessor'
 */

/**
 * @openapi
 * /professores:
 *   get:
 *     summary: Lista todos os professores
 *     description: Retorna todos os professores cadastrados. A operação é exclusiva para administradores.
 *     tags:
 *       - Professores
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       '200':
 *         description: Lista de professores retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Professor'
 *
 *       '401':
 *         description: Token ausente, inválido ou expirado.
 *
 *       '403':
 *         description: Acesso permitido apenas para administradores.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroProfessor'
 *
 *       '500':
 *         description: Erro interno ao listar os professores.
 */

/**
 * @openapi
 * /professores/perfil:
 *   get:
 *     summary: Consulta o perfil do professor autenticado
 *     description: Retorna os dados do professor identificado pelo professorId presente no JWT.
 *     tags:
 *       - Professores
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       '200':
 *         description: Perfil do professor retornado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professor'
 *
 *       '401':
 *         description: Token ausente, inválido ou expirado.
 *
 *       '403':
 *         description: Acesso permitido apenas para professores.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroProfessor'
 *
 *       '400':
 *         description: ID de professor inválido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroProfessor'
 *
 *       '404':
 *         description: Professor não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroProfessor'
 *
 *       '500':
 *         description: Erro interno ao consultar o perfil.
 */

/**
 * @openapi
 * /professores/perfil:
 *   put:
 *     summary: Atualiza o perfil do professor autenticado
 *     description: Permite atualizar os dados de acesso, os dados pessoais e a foto do professor. É necessário informar pelo menos um dado ou uma nova foto.
 *     tags:
 *       - Professores
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               dadosUsuario:
 *                 type: string
 *                 description: Objeto JSON serializado com pelo menos um campo entre email e senha.
 *                 example: '{"email":"novo@email.com"}'
 *               dadosProfessor:
 *                 type: string
 *                 description: Objeto JSON serializado com pelo menos um dado pessoal do professor.
 *                 example: '{"nome":"João Pedro","cidade":"Registro"}'
 *               foto:
 *                 type: string
 *                 format: binary
 *                 description: Nova foto de perfil (opcional).
 *
 *     responses:
 *       '200':
 *         description: Perfil atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: Perfil atualizado com sucesso!
 *                 professor:
 *                   $ref: '#/components/schemas/Professor'
 *
 *       '400':
 *         description: Dados inválidos ou nenhuma informação fornecida para atualização.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroProfessor'
 *
 *       '401':
 *         description: Token ausente, inválido ou expirado.
 *
 *       '403':
 *         description: Acesso permitido apenas para professores.
 *
 *       '404':
 *         description: Professor não encontrado para atualização.
 *
 *       '409':
 *         description: E-mail ou CPF já cadastrado.
 *
 *       '500':
 *         description: Erro interno durante a atualização.
 */

/**
 * @openapi
 * /professores/perfil:
 *   delete:
 *     summary: Exclui a conta do professor autenticado
 *     description: Exclui o cadastro do professor, suas credenciais de acesso e sua foto no Cloudinary. A exclusão não é permitida quando existem turmas vinculadas.
 *     tags:
 *       - Professores
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       '200':
 *         description: Professor e credenciais excluídos com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: Professor e credenciais de acesso excluídos com sucesso.
 *
 *       '400':
 *         description: ID de professor inválido.
 *
 *       '401':
 *         description: Token ausente, inválido ou expirado.
 *
 *       '403':
 *         description: Acesso permitido apenas para professores.
 *
 *       '404':
 *         description: Professor não encontrado para exclusão.
 *
 *       '409':
 *         description: Não é possível excluir um professor que possui turmas vinculadas.
 *
 *       '500':
 *         description: Erro interno durante a exclusão.
 */
