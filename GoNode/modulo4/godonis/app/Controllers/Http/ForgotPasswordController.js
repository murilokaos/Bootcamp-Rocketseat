'use strict'

const User = use('App/Models/User')
const Mail = use('Mail')
const crypto = require('crypto')
const subDays = require('date-fns/sub_days')
const isAfter = require('date-fns/is_after')

class ForgotPasswordController {
  async store ({ request, response }) {
    try {
      const email = request.input('email')

      const user = await User.findByOrFail('email', email)

      user.token = crypto.randomBytes(10).toString('hex')
      user.token_created_at = new Date()

      await user.save()

      await Mail.send(
        ['emails.forgot_password'],
        {
          token: user.token,
          email: user.email,
          name: user.username,
          link: `${request.input('redirect_url')}?token=${user.token}`
        },
        message => {
          message
            .to(user.email)
            .from('suporte@user.com', 'Murilo Henrique')
            .subject('Recuperação de senha')
        }
      )

      return {
        message: 'Recuperação de senha solicitada com sucesso!'
      }
    } catch (err) {
      return response.status(err.status).send({
        error: {
          message: 'Erro ao tentar recuperar senha, o email é realmente este?'
        }
      })
    }
  }

  async update ({ request, response }) {
    try {
      const { token, password } = request.only(['password', 'token'])
      const user = await User.findByOrFail('token', token)

      const tokenExpired = isAfter(
        subDays(new Date(), 2),
        user.token_created_at
      )

      if (tokenExpired) {
        return response.status(401).send({
          error: {
            message: 'Token expirado! Solicite um reset de senha novamente.'
          }
        })
      }

      user.token = null
      user.token_created_at = null
      user.password = password

      await user.save()

      await Mail.send(
        ['emails.reset_password'],
        {
          email: user.email,
          name: user.username
        },
        message => {
          message
            .to(user.email)
            .from('suporte@user.com', 'Murilo Henrique')
            .subject('Alteração de senha')
        }
      )

      return {
        message:
          'Pronto, você resetou sua senha e agora já pode utilizar a nova para fazer login no sistema.'
      }
    } catch (err) {
      return response.status(err.status).send({
        error: { message: 'Algo deu errado ao resetar a sua senha!' }
      })
    }
  }
}

module.exports = ForgotPasswordController