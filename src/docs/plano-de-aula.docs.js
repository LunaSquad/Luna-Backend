/**
 * @openapi
 * components:
 *   schemas:
 *     PlanoDeAula:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         materiaId:
 *           type: string
 *           description: Identificador da matéria vinculada.
 *         turmaId:
 *           type: string
 *           description: Identificador da turma vinculada.
 *         professorId:
 *           type: string
 *           description: Identificador do professor responsável.
 *         tipoConteudo:
 *           type: string
 *           enum:
 *             - manual
 *             - anexo
 *         titulo:
 *           type: string
 *           nullable: true
 *           example: Introdução à matemática
 *         descricao:
 *           type: string
 *           nullable: true
 *           example: Aula introdutória sobre operações básicas.
 *         dataAula:
 *           type: string
 *           format: date-time
 *         dataFechamento:
 *           type: string
 *           format: date-time
 *         urlPlanoDeAula:
 *           type: string
 *           nullable: true
 *           description: URL do arquivo armazenado no Cloudinary.
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         __v:
 *           type: integer
 *
 *     ErroPlanoDeAula:
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
 * /planos-de-aula:
 *   post:
 *     summary: Cadastra um plano de aula
 *     description: Cadastra um plano de aula vinculado a uma matéria, turma e professor. Permite conteúdo manual ou por anexo armazenado no Cloudinary.
 *     tags:
 *       - Planos de aula
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - dadosPlanoDeAula
 *             properties:
 *               dadosPlanoDeAula:
 *                 type: string
 *                 description: Objeto JSON serializado com os dados do plano de aula.
 *                 example: '{"materiaId":"507f1f77bcf86cd799439011","turmaId":"507f1f77bcf86cd799439012","tipoConteudo":"manual","titulo":"Introdução à matemática","descricao":"Aula sobre operações básicas.","dataAula":"2026-11-03","dataFechamento":"2026-11-05","horarioFechamento":"18:00"}'
 *               arquivo:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo do plano de aula (PDF, JPG, JPEG, PNG ou WEBP; limite de 5 MB). Obrigatório quando tipoConteudo for anexo e não utilizado quando for manual.
 *
 *     responses:
 *       '201':
 *         description: Plano de aula criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: Plano de aula criado com sucesso!
 *                 plano:
 *                   $ref: '#/components/schemas/PlanoDeAula'
 *
 *       '400':
 *         description: Dados inválidos, arquivo ausente no modo anexo ou identificador inválido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroPlanoDeAula'
 *
 *       '401':
 *         description: Token ausente, inválido ou expirado.
 *
 *       '403':
 *         description: Acesso permitido apenas para professores.
 *
 *       '404':
 *         description: Turma não encontrada ou não pertencente ao professor, ou matéria não encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroPlanoDeAula'
 *
 *       '500':
 *         description: Erro interno durante o cadastro.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroPlanoDeAula'
 */
