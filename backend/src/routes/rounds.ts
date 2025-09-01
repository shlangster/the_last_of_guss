import { FastifyPluginAsync } from 'fastify';
import { ROLES, ROUND_STATUS } from '../constants.js';
import { IRoundService } from '../interfaces/roundService.js';
import { IScoringStrategy } from '../interfaces/scoringStrategy.js';


export const roundRoutes: FastifyPluginAsync<{ roundService: IRoundService, scoringStrategy: IScoringStrategy }> = async(app, opts) => {

    const { roundService, scoringStrategy } = opts;


    app.get('/rounds', { preValidation: [app.auth] }, async (req) => {
        const rounds = await roundService.getRounds();
        return rounds;
    });

    app.post('/rounds', { preValidation: [app.auth] }, async (req, rep) => {
        if (req.user.role !== ROLES.ADMIN) return rep.code(403).send({
            error: 'forbidden'
        });
        const round = await roundService.createRound();
        return round;
    });

    app.get('/rounds/:id', { preValidation: [app.auth] }, async (req) => {
        const id = (req.params as any).id as string;
        const {status, round} = await roundService.getRoundWithStatus(id);

        const {myPoints, myTaps} = await roundService.getParticipantData(id, req.user.id);

        let winner: null | { userId: string; username: string; points: number } = null;
        if (status === ROUND_STATUS.FINISHED) {
            winner = await roundService.getRoundWinner(id);
        }
        return {
            id,
            startsAt: round.startsAt,
            endsAt: round.endsAt,
            status,
            totalPoints: round.totalPoints,
            me: { points: myPoints, taps: myTaps },
            winner
        };
    });

    app.post('/rounds/:id/tap', { preValidation: [app.auth] }, async (req, rep) => {

        const id = (req.params as any).id as string;
        try {
            const result = await roundService.tapTransactional(id, req.user.id, req.user.role, scoringStrategy);

            return { myPoints: result.points, myTaps: result.taps };
        } catch (e: any) {
            if (e?.message === 'Round is not active') return rep.code(409).send({
                error: 'round_not_active'
            });
            if (e?.message === 'Round not found') return rep.code(404).send({
                error: 'not_found'
            });
            app.log.error(e);
            
            return rep.code(500).send({ error: 'tap_failed' });
        }
    });
};