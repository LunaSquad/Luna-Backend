/**
 * @openapi
 * components:
 *   schemas:
 *     AtividadePlano:
 *       type: object
 *       properties:
 *         plano:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             titulo:
 *               type: string
 *               nullable: true
 *             descricao:
 *               type: string
 *               nullable: true
 *             materia:
 *               type: string
 *               nullable: true
 *             dataAula:
 *               type: string
 *               format: date-time
 *             dataFechamento:
 *               type: string
 *               format: date-time
 *         resumo:
 *           type: object
 *           properties:
 *             corrigidas:
 *               type: integer
 *               example: 2
 *             pendentes:
 *               type: integer
 *               example: 3
 *             total:
 *               type: integer
 *               description: Quantidade total de alunos vinculados à turma do plano.
 *               example: 5
 *         alunos:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AlunoStatusAtividade'
 *
 *     AlunoStatusAtividade:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         nome:
 *           type: string
 *         cpf:
 *           type: string
 *         urlFotoAluno:
 *           type: string
 *           nullable: true
 *         status:
 *           type: string
 *           enum:
 *             - Pendente
 *             - Entregue
 *             - Corrigido
 *         atividadeId:
 *           type: string
 *           nullable: true
 *
 *     AtividadeCorrecao:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         planoId:
 *           type: string
 *           nullable: true
 *         turmaId:
 *           type: string
 *         alunoId:
 *           type: string
 *           nullable: true
 *         usuarioId:
 *           type: string
 *           nullable: true
 *         nome:
 *           type: string
 *           example: João Silva
 *         avatarUrl:
 *           type: string
 *         titulo:
 *           type: string
 *           nullable: true
 *         status:
 *           type: string
 *           enum:
 *             - pendente
 *             - concluida
 *             - entregue
 *             - corrigida
 *         acertos:
 *           type: integer
 *         totalQuestoes:
 *           type: integer
 *         aproveitamento:
 *           type: integer
 *           description: Percentual de acertos calculado pela API.
 *           example: 80
 *         comentarioProfessor:
 *           type: string
 *         questoes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/QuestaoCorrecao'
 *
 *     QuestaoCorrecao:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         numero:
 *           type: integer
 *         enunciado:
 *           type: string
 *         respostaAluno:
 *           type: string
 *         respostaCorreta:
 *           type: string
 *         correta:
 *           type: boolean
 *
 *     ErroAtividade:
 *       type: object
 *       properties:
 *         erro:
 *           type: string
 *
 *     ErroValidacaoAtividade:
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
 * /atividades/plano/{planoId}:
 *   get:
 *     summary: Lista alunos e status das atividades de um plano
 *     description: Retorna os alunos vinculados à turma do plano de aula, seus status de entrega e um resumo das atividades corrigidas e pendentes.
 *     tags:
 *       - Atividades
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - name: planoId
 *         in: path
 *         required: true
 *         description: Identificador do plano de aula no MongoDB.
 *         schema:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *
 *     responses:
 *       '200':
 *         description: Alunos e status das atividades retornados com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AtividadePlano'
 *
 *       '400':
 *         description: ID do plano de aula ou do professor inválido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroAtividade'
 *
 *       '401':
 *         description: Token ausente, inválido ou expirado.
 *
 *       '403':
 *         description: Acesso permitido apenas para professores.
 *
 *       '404':
 *         description: Plano de aula não encontrado ou não pertencente ao professor autenticado.
 *
 *       '500':
 *         description: Erro interno ao listar as atividades.
 */

/**
 * @openapi
 * /atividades/{id}:
 *   get:
 *     summary: Busca uma atividade para correção
 *     description: Retorna as respostas de um aluno, o gabarito, o aproveitamento e os dados necessários para a correção individual. A atividade precisa possuir respostas entregues.
 *     tags:
 *       - Atividades
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Identificador da atividade no MongoDB.
 *         schema:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *
 *     responses:
 *       '200':
 *         description: Atividade encontrada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AtividadeCorrecao'
 *
 *       '400':
 *         description: ID inválido ou atividade sem respostas entregues.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroAtividade'
 *
 *       '401':
 *         description: Token ausente, inválido ou expirado.
 *
 *       '403':
 *         description: O professor não possui permissão para acessar esta atividade.
 *
 *       '404':
 *         description: Atividade não encontrada.
 *
 *       '500':
 *         description: Erro interno ao buscar a atividade.
 */

/**
 * @openapi
 * /atividades/{id}/correcao:
 *   patch:
 *     summary: Corrige uma atividade e envia feedback
 *     description: Registra o comentário do professor, altera o status da atividade para corrigida e registra a data da correção.
 *     tags:
 *       - Atividades
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Identificador da atividade no MongoDB.
 *         schema:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comentarioProfessor
 *             properties:
 *               comentarioProfessor:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 2000
 *                 example: Muito bem! Você demonstrou boa compreensão do conteúdo.
 *
 *     responses:
 *       '200':
 *         description: Feedback enviado e atividade corrigida com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: Feedback enviado e atividade corrigida com sucesso.
 *                 atividadeId:
 *                   type: string
 *                 status:
 *                   type: string
 *                   example: corrigida
 *                 comentarioProfessor:
 *                   type: string
 *                 dataCorrecao:
 *                   type: string
 *                   format: date-time
 *
 *       '400':
 *         description: ID inválido, comentário incorreto ou atividade ainda sem respostas.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroValidacaoAtividade'
 *
 *       '401':
 *         description: Token ausente, inválido ou expirado.
 *
 *       '403':
 *         description: O professor não possui permissão para corrigir esta atividade.
 *
 *       '404':
 *         description: Atividade não encontrada.
 *
 *       '500':
 *         description: Erro interno durante a correção.
 */
