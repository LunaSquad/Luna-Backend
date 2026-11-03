/**
 * @openapi
 * components:
 *   schemas:
 *     Materia:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Identificador da matéria no MongoDB.
 *         nome:
 *           type: string
 *           description: Nome da matéria.
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         __v:
 *           type: integer
 *           description: Versão do documento no MongoDB.
 *
 *     ErroMateria:
 *       type: object
 *       properties:
 *         erro:
 *           type: string
 */

/**
 * @openapi
 * /materias:
 *   get:
 *     summary: Lista todas as matérias
 *     description: Retorna todas as matérias cadastradas, ordenadas alfabeticamente pelo nome.
 *     tags:
 *       - Matérias
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       '200':
 *         description: Lista de matérias retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Materia'
 *
 *       '401':
 *         description: Token ausente, inválido ou expirado.
 *
 *       '403':
 *         description: Acesso permitido apenas para professores.
 *
 *       '500':
 *         description: Erro interno ao listar as matérias.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroMateria'
 */

/**
 * @openapi
 * /materias/{id}:
 *   get:
 *     summary: Busca uma matéria pelo ID
 *     description: Retorna os dados de uma matéria específica utilizando seu identificador no MongoDB.
 *     tags:
 *       - Matérias
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Identificador da matéria no MongoDB.
 *         schema:
 *           type: string
 *
 *     responses:
 *       '200':
 *         description: Matéria encontrada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Materia'
 *
 *       '400':
 *         description: ID da matéria inválido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroMateria'
 *             example:
 *               erro: ID da matéria inválido.
 *
 *       '401':
 *         description: Token ausente, inválido ou expirado.
 *
 *       '403':
 *         description: Acesso permitido apenas para professores.
 *
 *       '404':
 *         description: Matéria não encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroMateria'
 *             example:
 *               erro: Matéria não encontrada.
 *
 *       '500':
 *         description: Erro interno ao buscar a matéria.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroMateria'
 */
