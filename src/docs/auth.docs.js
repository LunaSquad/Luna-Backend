/**
 * @openapi
 * /login:
 *   post:
 *     summary: Realiza o login do usuário
 *     description: Autentica professores e administradores e retorna um token JWT.
 *     tags:
 *       - Autenticação
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 description: E-mail cadastrado pelo usuário.
 *                 example: professor@email.com
 *               senha:
 *                 type: string
 *                 description: Senha do usuário.
 *                 example: senha123
 *
 *     responses:
 *       '200':
 *         description: Login realizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: Login realizado com sucesso!
 *                 token:
 *                   type: string
 *                   description: Token JWT com validade de 1 dia.
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     email:
 *                       type: string
 *                       example: professor@email.com
 *                     tipoUser:
 *                       type: string
 *                       enum:
 *                         - professor
 *                         - admin
 *                     nome:
 *                       type: string
 *                       description: Retornado quando o usuário é professor.
 *                       example: Ana
 *                     foto:
 *                       type: string
 *                       description: URL da foto, retornada quando o usuário é professor.
 *                       example: https://caminho-para-imagem-padrao.com/foto.png
 *
 *       '401':
 *         description: E-mail ou senha inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 erro:
 *                   type: string
 *                   example: E-mail ou senha inválidos.
 *
 *       '403':
 *         description: Tipo de usuário não autorizado para o sistema web.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 erro:
 *                   type: string
 *                   example: Acesso ao sistema web não autorizado para este usuário.
 *
 *       '500':
 *         description: Erro interno durante a autenticação.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 erro:
 *                   type: string
 *                   example: Erro interno ao realizar o login.
 */
