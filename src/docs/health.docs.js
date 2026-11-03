/**
 * @openapi
 * /health:
 *   get:
 *     summary: Verifica o estado da API
 *     description: Verifica se a API está respondendo e se existe conexão ativa com o MongoDB.
 *     tags:
 *       - Health Check
 *
 *     responses:
 *       '200':
 *         description: API e banco de dados funcionando corretamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-11-02T17:55:12.000Z"
 *                 services:
 *                   type: object
 *                   properties:
 *                     api:
 *                       type: string
 *                       example: ok
 *                     database:
 *                       type: string
 *                       example: connected
 *
 *       '503':
 *         description: API disponível, mas conexão com MongoDB indisponível.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 services:
 *                   type: object
 *                   properties:
 *                     api:
 *                       type: string
 *                       example: ok
 *                     database:
 *                       type: string
 *                       example: disconnected
 */
