/**
 * @openapi
 * components:
 *   schemas:
 *     Turma:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         nome:
 *           type: string
 *           example: 3º Ano A
 *         professorId:
 *           type: string
 *           description: Identificador do professor responsável.
 *         codigoConvite:
 *           type: string
 *           description: Código de convite gerado automaticamente.
 *           example: ABC123
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         __v:
 *           type: integer
 *
 *     TurmaSimples:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         nome:
 *           type: string
 *           example: 3º Ano A
 *
 *     TurmaCompleta:
 *       allOf:
 *         - $ref: '#/components/schemas/Turma'
 *         - type: object
 *           properties:
 *             quantidadeAlunos:
 *               type: integer
 *               example: 25
 *             atividades:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 10
 *                 feitas:
 *                   type: integer
 *                   example: 6
 *                 pendentes:
 *                   type: integer
 *                   example: 4
 *                 progresso:
 *                   type: integer
 *                   description: Percentual de atividades concluídas.
 *                   example: 60
 *
 *     ErroTurma:
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
 * /turmas:
 *   post:
 *     summary: Cadastra uma nova turma
 *     description: Cria uma turma vinculada ao professor autenticado. O código de convite é gerado automaticamente.
 *     tags:
 *       - Turmas
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dadosTurma
 *             properties:
 *               dadosTurma:
 *                 type: object
 *                 required:
 *                   - nome
 *                 properties:
 *                   nome:
 *                     type: string
 *                     minLength: 3
 *                     maxLength: 100
 *                     example: 3º Ano A
 *
 *     responses:
 *       '201':
 *         description: Turma cadastrada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: Turma registrada com sucesso!
 *                 turma:
 *                   $ref: '#/components/schemas/Turma'
 *                 linkConvite:
 *                   type: string
 *                   example: luna://app/convite?codigo=ABC123&turmaId=507f1f77bcf86cd799439011
 *
 *       '400':
 *         description: Dados inválidos ou ID de professor inválido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroTurma'
 *
 *       '401':
 *         description: Token ausente, inválido ou expirado.
 *
 *       '403':
 *         description: Acesso permitido apenas para professores.
 *
 *       '409':
 *         description: Já existe uma turma com esse nome para o professor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroTurma'
 *
 *       '500':
 *         description: Erro interno no servidor.
 */

/**
 * @openapi
 * /turmas:
 *   get:
 *     summary: Lista as turmas do professor autenticado
 *     description: Retorna as turmas vinculadas ao professor. Permite escolher entre o formato simples e o completo.
 *     tags:
 *       - Turmas
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - name: formato
 *         in: query
 *         required: false
 *         description: Formato dos dados retornados. O padrão é completo.
 *         schema:
 *           type: string
 *           enum:
 *             - simples
 *             - completo
 *           default: completo
 *
 *     responses:
 *       '200':
 *         description: Lista de turmas retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 oneOf:
 *                   - $ref: '#/components/schemas/TurmaSimples'
 *                   - $ref: '#/components/schemas/TurmaCompleta'
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
 *       '500':
 *         description: Erro interno ao listar as turmas.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroTurma'
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     TurmaDetalhada:
 *       allOf:
 *         - $ref: '#/components/schemas/Turma'
 *         - type: object
 *           properties:
 *             linkConvite:
 *               type: string
 *               example: luna://app/convite?codigo=ABC123&turmaId=507f1f77bcf86cd799439011
 *             resumo:
 *               type: object
 *               properties:
 *                 totalAlunos:
 *                   type: integer
 *                   example: 25
 *                 totalAtividades:
 *                   type: integer
 *                   example: 10
 *                 pendentes:
 *                   type: integer
 *                   example: 4
 *             alunos:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   usuarioId:
 *                     type: string
 *                   nome:
 *                     type: string
 *                   cpf:
 *                     type: string
 *                   urlFotoAluno:
 *                     type: string
 *                   hiperfoco:
 *                     type: object
 *                     nullable: true
 *                     properties:
 *                       hiperfoco:
 *                         type: string
 *                         nullable: true
 *                       urlFotoHiperfoco:
 *                         type: string
 *                         nullable: true
 *                   desempenho:
 *                     type: integer
 *                     description: Percentual de acertos do aluno nas atividades respondidas.
 *                     example: 85
 *                   situacao:
 *                     type: string
 *                     enum:
 *                       - Sem atividades
 *                       - Excelente
 *                       - Bom
 *                       - Atenção
 *             atividades:
 *               type: array
 *               description: Planos de aula associados à turma, com o status de conclusão.
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   materiaId:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       nome:
 *                         type: string
 *                   turmaId:
 *                     type: string
 *                   professorId:
 *                     type: string
 *                   tipoConteudo:
 *                     type: string
 *                     enum:
 *                       - manual
 *                       - anexo
 *                   titulo:
 *                     type: string
 *                     nullable: true
 *                   descricao:
 *                     type: string
 *                     nullable: true
 *                   dataAula:
 *                     type: string
 *                     format: date-time
 *                   dataFechamento:
 *                     type: string
 *                     format: date-time
 *                   urlPlanoDeAula:
 *                     type: string
 *                     nullable: true
 *                   statusTurma:
 *                     type: string
 *                     enum:
 *                       - concluida
 *                       - pendente
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                   __v:
 *                     type: integer
 *
 * /turmas/{id}:
 *   get:
 *     summary: Busca uma turma pelo ID
 *     description: Retorna os dados da turma, seus alunos com indicadores de desempenho e seus planos de aula com status de conclusão.
 *     tags:
 *       - Turmas
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Identificador da turma no MongoDB.
 *         schema:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *
 *     responses:
 *       '200':
 *         description: Turma encontrada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TurmaDetalhada'
 *
 *       '400':
 *         description: ID da turma ou do professor inválido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroTurma'
 *
 *       '401':
 *         description: Token ausente, inválido ou expirado.
 *
 *       '403':
 *         description: Acesso permitido apenas para professores.
 *
 *       '404':
 *         description: Turma não encontrada ou não vinculada ao professor autenticado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroTurma'
 *             example:
 *               erro: Turma não encontrada.
 *
 *       '500':
 *         description: Erro interno ao buscar a turma.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroTurma'
 */

/**
 * @openapi
 * /turmas/{id}:
 *   put:
 *     summary: Atualiza uma turma
 *     description: Atualiza os dados da turma pertencente ao professor autenticado.
 *     tags:
 *       - Turmas
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Identificador da turma no MongoDB.
 *         schema:
 *           type: string
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dadosTurma
 *             properties:
 *               dadosTurma:
 *                 type: object
 *                 required:
 *                   - nome
 *                 properties:
 *                   nome:
 *                     type: string
 *                     minLength: 3
 *                     maxLength: 100
 *                     example: 3º Ano B
 *
 *     responses:
 *       '200':
 *         description: Turma atualizada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Turma'
 *
 *       '400':
 *         description: Dados inválidos ou identificador incorreto.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroTurma'
 *
 *       '401':
 *         description: Token ausente, inválido ou expirado.
 *
 *       '403':
 *         description: Acesso permitido apenas para professores.
 *
 *       '404':
 *         description: Turma não encontrada ou não vinculada ao professor.
 *
 *       '409':
 *         description: Já existe outra turma com o mesmo nome para o professor.
 *
 *       '500':
 *         description: Erro interno durante a atualização.
 */

/**
 * @openapi
 * /turmas/{id}:
 *   delete:
 *     summary: Exclui uma turma
 *     description: Exclui a turma do professor autenticado, desvincula os alunos e remove os planos de aula associados.
 *     tags:
 *       - Turmas
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Identificador da turma no MongoDB.
 *         schema:
 *           type: string
 *
 *     responses:
 *       '200':
 *         description: Turma excluída e alunos desvinculados com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: Turma excluída e alunos desvinculados com sucesso.
 *
 *       '400':
 *         description: Identificador da turma ou professor inválido.
 *
 *       '401':
 *         description: Token ausente, inválido ou expirado.
 *
 *       '403':
 *         description: Acesso permitido apenas para professores.
 *
 *       '404':
 *         description: Turma não encontrada ou não vinculada ao professor.
 *
 *       '500':
 *         description: Erro interno durante a exclusão.
 */
