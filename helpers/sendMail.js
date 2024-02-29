import nodemailer from "nodemailer";

export const emailRegistro = async (datos) => {
    const { email, nombre, token, codeOTP } = datos;

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Información del email, codigo otp para confirmar el correo

    await transport.sendMail({
        from: '"Ejemplo"',
        to: email,
        subject: "Confirma tu correo",
        text: "Confirma tu correo",
        html: `
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet">
      <style>
          body {
              font-family: 'Poppins', sans-serif;
          }
      </style>
      <script src=${"https://cdn.tailwindcss.com"}></script>
      </head>
  
      <body>
  
          <header class="flex justify-center items-center bg-gradient-to-r from-cyan-400 to-blue-500">
              
              <div>
                  <h1 class="my-10 text-white text-3xl font-bold">Huejutla Delfines</h1>
              </div>
          </header>
  
          <main class="bg-gradient-to-r from-cyan-400 to-blue-500">
              <section class="flex flex-col container mx-auto justify-center items-center text-center pb-5">
                  <h2 class="text-center text-white text-3xl font-bold my-5">
                      Hola ${nombre}, Has solicitado confirmar tu correo
                  </h2>
  
                  <div class="text-2xl font-bold">
                      <p>El código de confirmación es: </p>
                      <p class="text-5xl font-extrabold my-5 text-slate-200"> ${codeOTP}</p>
                      <p>Da click el siguiente enlace para confirmar tu correo: </p>
                      <div class="my-10">
                          <a href="${process.env.FRONTEND_URL}/confirmar/${token}"
                              class="py-5 bg-yellow-400 hover:bg-yellow-500 cursor-pointer my-10 px-2 rounded-sm">Confirmar
                              Correo</a>
                      </div>
  
                      <p>Si tu no solicitaste este email, puedes ignorar el mensaje.</p>
                  </div>
              </section>
          </main>
          <scrip src="https://cdn.tailwindcss.com"></scrip>
      </body>
      `,
    });

};

export const emailResetPassword = async (datos) => {
    const { email, nombre, token, codeOTP } = datos;

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Información del email, codigo otp para confirmar el correo

    await transport.sendMail({
        from: '"Ejemplo"',
        to: email,
        subject: "Restablecer contraseña",
        text: "Restablecer contraseña",
        html: `
     
      <body>
  
          <header class="flex justify-center items-center bg-gradient-to-r from-cyan-400 to-blue-500">
              
              <div>
                  <h1 class="my-10 text-white text-3xl font-bold">Huejutla Delfines</h1>
                </div>
            </header>

            <main class="bg-gradient-to-r from-cyan-400 to-blue-500">
                <section class="flex flex-col container mx-auto justify-center items-center text-center pb-5">
                    <h2 class="text-center text-white text-3xl font-bold my-5">
                        Hola ${nombre}, Has solicitado restablecer tu contraseña
                    </h2>

                    <div class="text-2xl font-bold">
                    <p>El código de confirmación es: </p>
                    <p class="text-5xl font-extrabold my-5 text-slate-200"> ${codeOTP}</p>

                        <p>Si tu no solicitaste este email, puedes ignorar el mensaje.</p>
                    </div>
                </section>

            </main>


        </body>

        `,
    });
}