

module.exports = {

    post: (req, res) => {
        //세션아이디가 없다면 로그인한 적이 없으므로
        if (!req.session.userId) {
            res.status(400).send('who are you?')

        } else {
            //세션을 파괴해준다.
            req.session.destroy(() => {
                res.status(205).send('goodbye~~~')
            });
        }
    }
}
