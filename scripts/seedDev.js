import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

import Usuario from "../src/models/usuario.model.js";
import Professor from "../src/models/professor.model.js";
import Turma from "../src/models/turma.model.js";
import Aluno from "../src/models/aluno.model.js";
import Materia from "../src/models/materia.model.js";
import PlanoDeAula from "../src/models/plano-de-aula.model.js";
import Atividade from "../src/models/atividade.model.js";

/**
 * Seed de desenvolvimento da Luna.
 *
 * Cria dados fictícios para testar a API localmente. O conteúdo do plano,
 * da atividade gerada e da resposta foi adaptado dos documentos exportados
 * do banco mobile, com os relacionamentos remapeados para os registros deste seed.
 *
 * É idempotente: pode ser executado várias vezes sem duplicar os registros
 * de demonstração. Não apaga coleções nem registros existentes.
 */

const SENHA_PROFESSOR = "Luna@123";
const SENHA_ALUNO = "Aluno@123";

// Bases fictícias de CPF; os dígitos verificadores são calculados abaixo.
const basesCpf = {
  camila: "314159265",
  rafael: "271828182",
  beatriz: "161803398",
  marina: "141421356",
  pedro: "173205080",
  laura: "223606797",
  gabriel: "244948974",
  isabela: "316227766",
  arthur: "264575131",
  sofia: "331662479",
  enzo: "346410161",
};

function gerarCpf(base) {
  const digitos = base.split("").map(Number);

  for (let etapa = 0; etapa < 2; etapa += 1) {
    const soma = digitos.reduce(
      (total, digito, indice) => total + digito * (10 + etapa - indice),
      0
    );
    const resto = (soma * 10) % 11;
    digitos.push(resto === 10 ? 0 : resto);
  }

  return digitos.join("");
}

function garantirBancoLocal(uri) {
  let host;

  try {
    host = new URL(uri).hostname;
  } catch {
    throw new Error("DB_URL não contém uma URI MongoDB válida.");
  }

  const hostsPermitidos = new Set([
    "localhost",
    "127.0.0.1",
    "::1",
    "db",
    "mongo",
    "mongo-dev",
  ]);

  if (!hostsPermitidos.has(host)) {
    throw new Error(
      "Por segurança, o seedDev.js só pode rodar em MongoDB local/Docker. " +
        `Host recebido: ${host}. Use mongodb://localhost:27017/luna ou execute dentro do container da API.`
    );
  }
}

async function upsertUsuario({ email, tipoUser, senha }) {
  const senhaHash = await bcrypt.hash(senha, 10);

  return Usuario.findOneAndUpdate(
    { email },
    { $set: { email, senha: senhaHash, tipoUser } },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );
}

async function upsertMateria(nome) {
  return Materia.findOneAndUpdate(
    { nome },
    { $setOnInsert: { nome } },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );
}

async function upsertProfessor(usuario, dados) {
  return Professor.findOneAndUpdate(
    { usuarioId: usuario._id },
    { $set: { ...dados, usuarioId: usuario._id } },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );
}

async function upsertTurma(professor, nome) {
  return Turma.findOneAndUpdate(
    { professorId: professor._id, nome },
    { $setOnInsert: { professorId: professor._id, nome } },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );
}

async function upsertAluno(usuario, turma, dados) {
  return Aluno.findOneAndUpdate(
    { usuarioId: usuario._id },
    {
      $set: {
        ...dados,
        usuarioId: usuario._id,
        turmaId: turma._id,
      },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );
}

async function upsertPlano(professor, turma, materia, dados) {
  return PlanoDeAula.findOneAndUpdate(
    {
      professorId: professor._id,
      turmaId: turma._id,
      titulo: dados.titulo,
    },
    {
      $set: {
        ...dados,
        professorId: professor._id,
        turmaId: turma._id,
        materiaId: materia._id,
      },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );
}

// Conteúdo de atividade gerada pela IA exportado do banco mobile.
// userID foi convertido para alunoID; questoesGerais é omitido porque não
// existe no model atual. As questões estão preservadas em atividades[].questoes.
const CONTEUDO_ATIVIDADE_IA = {
  hiperfoco: "dinossauros",
  moldeUsado: "molde_humanas_narrativo_tdah",
  temaDetectado: "História",
  urlPlanoOriginal:
    "https://res.cloudinary.com/dhkotadvd/image/upload/v1793122021/plano_de_aula_historia_idade_media_xml2yr.pdf",
  assetsVisuais: [
    "https://image.pollinations.ai/prompt/masterpiece%202D%20flat%20vector%20mobile%20game%20background%20illustration%2C%20vibrant%20prehistoric%20valley%20with%20a%20smoking%20volcano%20in%20the%20center%20distance%2C%20sparkling%20waterfall%2C%20lush%20green%20palm%20trees%2C%20warm%20golden%20sunset%20sky%2C%20high%20contrast%2C%20crisp%20vector%20lines%2C%20Khan%20Academy%20Kids%20art%20style%2C%20vertical%20mobile%20game%20wallpaper%2C%208k%20resolution%2C%20no%20text%2C%20no%20watermark?width=1080&height=1920&nologo=true&model=flux&seed=8088",
    "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/T-Rex.png",
    "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Sauropod.png",
    "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Egg.png",
  ],
  versaoCache: "v4_gamificado",
  tituloAdaptado:
    "A Jornada Jurássica: Desvendando a Era dos Grandes Dinossauros!",
  temaOriginal: "Idade Média",
  disciplina: "História",
  explicacaoTeorica:
    "Prepare-se para uma viagem no tempo até a Era dos Grandes Dinossauros, um período emocionante e cheio de transformações que durou mais que muitos rugidos e caçadas. Vamos desvendar como os dinossauros se organizavam, o que era importante para eles e como seus mundos mudaram, tudo isso antes do grande asteroide!",
  topicosExplicacao: [
    {
      subtitulo: "O Que Foi a Era dos Grandes Dinossauros?",
      textoAdaptado:
        "A Era dos Grandes Dinossauros foi um longo período na história dos nossos répteis gigantes, que começou aproximadamente quando a hegemonia dos pterossauros antigos foi desafiada por novos predadores, e terminou com a ascensão dos temíveis T-Rex como dominadores supremos. Esses momentos são como marcos de pegadas gigantes no tempo, mas as mudanças aconteceram de forma gradual, como a formação de novas trilhas na selva, e de maneiras diferentes em cada vale e planície jurássica.",
      dicaVisual:
        "Imagine uma linha do tempo cheia de pegadas de dinossauro! Cada pegada marca um grande evento.",
    },
    {
      subtitulo: "Vales de Pastagem e Territórios de Caça",
      textoAdaptado:
        "Durante grande parte da Era dos Grandes Dinossauros, a busca por alimentos e a proteção dos territórios eram as atividades mais importantes. A terra, com seus rios e florestas de samambaias, era a fonte essencial de sustento e poder para as grandes matilhas e rebanhos. Em vales específicos, os 'Territórios de Caça Primordiais' ou 'Feudos de Dinos', grandes extensões reuniam fontes de água, áreas de pastagem, tocas e, às vezes, até ninhos fortificados. A comida era principalmente para a própria matilha ou rebanho, mas existiam trocas estratégicas de recursos com outros grupos.",
      dicaVisual:
        "Pense nos maiores dinossauros cuidando de seus vastos territórios, cheios de alimentos e proteção!",
    },
    {
      subtitulo: "A Sociedade dos Dinossauros",
      textoAdaptado:
        "A sociedade dos dinossauros era bem diferente, com grandes hierarquias de poder e recursos. Entre os grupos mais importantes estavam os 'Dinossauros Alfa', ligados à defesa do território e à posse das melhores áreas de caça; os 'Sábios Anciões', que guardavam os conhecimentos sobre as melhores rotas e fontes de alimento; e os 'Dinossauros Trabalhadores', como os Parassaurolofos coletores ou os Anquilossauros protetores, responsáveis por grande parte da procura por sustento. É importante saber que essa divisão é uma simplificação, pois a sociedade dinossáurica também incluía dinossauros trocadores de recursos e outros grupos, variando conforme a região e a época. Muitos dinossauros menores tinham obrigações com os grupos dominantes para ter acesso a fontes de água e proteção.",
      dicaVisual:
        "Imagine o T-Rex sendo o líder, o Brachiosaurus o sábio e o Triceratops o trabalhador! Cada um com sua função.",
    },
    {
      subtitulo: "Os Guardiões da Sabedoria Ancestral",
      textoAdaptado:
        "A 'Confraria dos Sábios Dinossauros' ou 'Guardiões do Grande Ovo Ancestral' tinha uma influência enorme na Era dos Grandes Dinossauros. Além de guiar os rituais de caça e a preservação do equilíbrio da natureza, eles participavam da transmissão de ensinamentos, da criação de mapas de caça e da preservação de conhecimentos sobre espécies e rotas em cavernas especiais. Grandes ninhos comunitários e formações rochosas serviam como centros importantes de aprendizado e união. Ao mesmo tempo, diferentes clãs de dinossauros, com seus próprios rugidos e costumes, contribuíram para o vasto conhecimento daquela era, incluindo os dinossauros dos vales mais distantes e das montanhas.",
      dicaVisual:
        "Pense nos Pterodáctilos voando e observando tudo, guardando segredos e transmitindo-os aos mais jovens!",
    },
    {
      subtitulo: "Rotas de Troca e Grandes Ninhos Comunitários",
      textoAdaptado:
        "A partir de certo momento, em várias regiões jurássicas, o aumento na produção de alimento e o crescimento das trocas favoreceram a formação de grandes pontos de encontro, trilhas de comércio e o desenvolvimento de 'Grandes Ninhos Comunitários'. Dinossauros trocadores de recursos e artesãos de ossos ganharam mais importância. Essas transformações não aconteceram ao mesmo tempo em todas as selvas e desertos, mas contribuíram para grandes mudanças na forma como os dinossauros se alimentavam e se organizavam em sociedade.",
      dicaVisual:
        "Imagine grandes grupos de dinossauros se encontrando em um vale para trocar folhas, frutas e pedras brilhantes!",
    },
    {
      subtitulo: "Por Que Estudar a Era dos Dinossauros?",
      textoAdaptado:
        "Estudar a Era dos Grandes Dinossauros ajuda a entender como essas sociedades pré-históricas se organizavam, como os rituais e a busca por alimento influenciavam a vida de todos, como funcionavam as relações de caça e poder, e como o comércio e os grandes ninhos comunitários se transformaram. Também é importante evitar a ideia de que todo o período foi igual ou que se resumiu à falta de inteligência: houve grande criatividade na caça, descobertas de novas rotas, e desenvolvimento de estratégias de defesa em diferentes sociedades dinossáuricas.",
      dicaVisual:
        "Descobrir o passado dos dinossauros é como montar um grande quebra-cabeça pré-histórico!",
    },
  ],
  temExemplo: true,
  exemploPratico:
    "Vamos imaginar que somos um pequeno Velociraptor observando a sociedade dos dinossauros para entender como a 'Confraria dos Sábios Dinossauros' influenciava a vida de todos.",
  topicosExemplo: [
    {
      titulo: "Exemplo Prático: A Influência dos Sábios no Vale",
      passoAPasso:
        "1. Observamos um grupo de Brachiosaurus antigos, os 'Sábios Anciões', perto de uma grande caverna. Eles estão transmitindo para os dinossauros mais jovens os segredos das melhores folhas e dos rios seguros para beber água.\n2. Vemos também como eles guardam, nas paredes da caverna, pinturas de caças antigas e rotas de migração, preservando o conhecimento para o futuro.\n3. Notamos que os rituais de coleta e caça são sempre iniciados com a benção dos Sábios, mostrando sua grande importância para a comunidade.\n4. Quando há um problema, como a falta de água em um rio, os dinossauros buscam os Sábios para pedir conselhos sobre onde encontrar novas fontes.",
      conclusao:
        "Percebemos que os 'Sábios Anciões' ou 'Guardiões do Grande Ovo Ancestral' não eram apenas figuras religiosas, mas também os principais educadores e guardiões do conhecimento vital para a sobrevivência e organização dos dinossauros, influenciando todas as áreas da vida no vale.",
    },
  ],
  atividades: [
    {
      titulo: "Missão na Fase: Desvendando o Passado Jurássico!",
      conteudoAdaptado:
        "É hora de testar seus conhecimentos sobre a Era dos Grandes Dinossauros! Responda às questões e prove que você é um verdadeiro Paleontólogo do Tempo.",
      questoes: [
        {
          tituloAtividade: "Missão na Fase: Desvendando o Passado Jurássico!",
          comandoAtividade:
            "É hora de testar seus conhecimentos sobre a Era dos Grandes Dinossauros! Responda às questões e prove que você é um verdadeiro Paleontólogo do Tempo.",
          tipo: "objetiva",
          pergunta:
            "Qual das opções abaixo melhor descreve o período da Era dos Grandes Dinossauros e um de seus marcos importantes?",
          dicaTDAH:
            "Pense no primeiro grande evento que mudou tudo para os dinossauros antigos e o que marcou o início.",
          respostaCorreta:
            "Uma fase na história dos répteis gigantes que começou com a hegemonia dos pterossauros antigos sendo desafiada.",
          alternativas: [
            "1. Um período curto de domínio dos mamutes na Era Glacial.",
            "2. Uma fase na história dos répteis gigantes que começou com a hegemonia dos pterossauros antigos sendo desafiada.",
            "3. O momento em que todos os dinossauros desapareceram de repente sem explicação.",
            "4. Uma época em que os T-Rex eram pequenos e não tinham importância.",
          ],
        },
        {
          tituloAtividade: "Missão na Fase: Desvendando o Passado Jurássico!",
          comandoAtividade:
            "É hora de testar seus conhecimentos sobre a Era dos Grandes Dinossauros! Responda às questões e prove que você é um verdadeiro Paleontólogo do Tempo.",
          tipo: "objetiva",
          pergunta:
            "Como a posse de 'Territórios de Caça Primordiais' e o acesso a alimentos influenciavam a vida social dos dinossauros?",
          dicaTDAH:
            "Lembre-se de quem detinha o poder e quem trabalhava para se sustentar.",
          respostaCorreta:
            "Gerava grandes diferenças de poder e riqueza, com Dinossauros Alfa e Dinossauros Trabalhadores.",
          alternativas: [
            "1. Isso não tinha impacto, todos os dinossauros eram iguais e dividiam tudo.",
            "2. Gerava grandes diferenças de poder e riqueza, com Dinossauros Alfa e Dinossauros Trabalhadores.",
            "3. Apenas os Pterodáctilos eram afetados, pois voavam sobre todos os territórios.",
            "4. Faziam com que todos os dinossauros se alimentassem apenas de folhas e frutas.",
          ],
        },
        {
          tituloAtividade: "Missão na Fase: Desvendando o Passado Jurássico!",
          comandoAtividade:
            "É hora de testar seus conhecimentos sobre a Era dos Grandes Dinossauros! Responda às questões e prove que você é um verdadeiro Paleontólogo do Tempo.",
          tipo: "objetiva",
          pergunta:
            "Qual alternativa descreve corretamente uma característica importante de parte da sociedade dinossáurica da Era dos Grandes Dinossauros?",
          dicaTDAH:
            "Pense no que era essencial para a sobrevivência e o poder dos clãs de dinossauros.",
          respostaCorreta:
            "A busca por alimento e a proteção dos territórios tinham grande importância, sendo a terra uma fonte de sustento e poder.",
          alternativas: [
            "1. A criação de fábricas de vapor era a principal atividade econômica de todos os vales.",
            "2. A busca por alimento e a proteção dos territórios tinham grande importância, sendo a terra uma fonte de sustento e poder.",
            "3. Todos os dinossauros tinham os mesmos rugidos, deveres e condições de vida, sem hierarquias.",
            "4. Os pontos de encontro para trocas e os 'Grandes Ninhos Comunitários' deixaram de existir durante todo o período.",
          ],
        },
        {
          tituloAtividade: "Missão na Fase: Desvendando o Passado Jurássico!",
          comandoAtividade:
            "É hora de testar seus conhecimentos sobre a Era dos Grandes Dinossauros! Responda às questões e prove que você é um verdadeiro Paleontólogo do Tempo.",
          tipo: "objetiva",
          pergunta:
            "Qual foi uma das funções desempenhadas pela 'Confraria dos Sábios Dinossauros' na Era dos Grandes Dinossauros?",
          dicaTDAH:
            "Lembre-se de quem guardava o conhecimento e ensinava os mais jovens.",
          respostaCorreta:
            "Exercer grande influência na orientação dos rituais, participar da transmissão de ensinamentos e da preservação de conhecimentos.",
          alternativas: [
            "1. Substituir toda a busca por alimento por caçadas de pequenos insetos.",
            "2. Eliminar a transmissão de histórias e a criação de mapas de caça nas cavernas.",
            "3. Exercer grande influência na orientação dos rituais, participar da transmissão de ensinamentos e da preservação de conhecimentos.",
            "4. Impedir que qualquer novo conhecimento sobre presas e predadores fosse descoberto.",
          ],
        },
      ],
    },
  ],
  explicacaoAdaptada:
    "Prepare-se para uma viagem no tempo até a Era dos Grandes Dinossauros, um período emocionante e cheio de transformações que durou mais que muitos rugidos e caçadas. Vamos desvendar como os dinossauros se organizavam, o que era importante para eles e como seus mundos mudaram, tudo isso antes do grande asteroide!",
};

// Resposta corrigida exportada do mesmo fluxo mobile.
const CONTEUDO_RESPOSTA = {
  titulo: "A Jornada Jurássica: Desvendando a Era dos Grandes Dinossauros!",
  materia: "História",
  acertos: 2,
  totalQuestoes: 4,
  respostas: [
    {
      numeroQuestao: 1,
      pergunta:
        "Qual das opções abaixo melhor descreve o período da Era dos Grandes Dinossauros e um de seus marcos importantes?",
      respostaAluno:
        "3. O momento em que todos os dinossauros desapareceram de repente sem explicação.",
      respostaCorreta:
        "1. Um período curto de domínio dos mamutes na Era Glacial.",
      acertou: false,
      tipo: "objetiva",
    },
    {
      numeroQuestao: 2,
      pergunta:
        "Como a posse de 'Territórios de Caça Primordiais' e o acesso a alimentos influenciavam a vida social dos dinossauros?",
      respostaAluno:
        "1. Isso não tinha impacto, todos os dinossauros eram iguais e dividiam tudo.",
      respostaCorreta:
        "1. Isso não tinha impacto, todos os dinossauros eram iguais e dividiam tudo.",
      acertou: true,
      tipo: "objetiva",
    },
    {
      numeroQuestao: 3,
      pergunta:
        "Qual alternativa descreve corretamente uma característica importante de parte da sociedade dinossáurica da Era dos Grandes Dinossauros?",
      respostaAluno:
        "2. A busca por alimento e a proteção dos territórios tinham grande importância, sendo a terra uma fonte de sustento e poder.",
      respostaCorreta:
        "1. A criação de fábricas de vapor era a principal atividade econômica de todos os vales.",
      acertou: false,
      tipo: "objetiva",
    },
    {
      numeroQuestao: 4,
      pergunta:
        "Qual foi uma das funções desempenhadas pela 'Confraria dos Sábios Dinossauros' na Era dos Grandes Dinossauros?",
      respostaAluno:
        "1. Substituir toda a busca por alimento por caçadas de pequenos insetos.",
      respostaCorreta:
        "1. Substituir toda a busca por alimento por caçadas de pequenos insetos.",
      acertou: true,
      tipo: "objetiva",
    },
  ],
  status: "corrigida",
  comentarioProfessor: "Ai chaves!",
  dataCorrecao: "2026-11-02T02:55:53.185Z",
};

async function upsertAtividadeGerada({ plano, aluno, turma, materia }) {
  const dados = {
    ...CONTEUDO_ATIVIDADE_IA,
    totalQuestoes: (CONTEUDO_ATIVIDADE_IA.atividades ?? []).reduce(
      (total, atividade) => total + (atividade.questoes?.length ?? 0),
      0
    ),
    planoOrigemID: String(plano._id),
    alunoID: String(aluno._id),
    turmaID: String(turma._id),
    materiaID: String(materia._id),
  };

  return Atividade.findOneAndUpdate(
    {
      planoOrigemID: dados.planoOrigemID,
      alunoID: dados.alunoID,
      tituloAdaptado: dados.tituloAdaptado,
      "respostas.0": { $exists: false },
    },
    { $set: dados },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );
}

async function upsertResposta({ plano, aluno, turma, materia }) {
  const dados = {
    ...CONTEUDO_RESPOSTA,
    planoID: String(plano._id),
    alunoID: String(aluno._id),
    turmaID: String(turma._id),
    materiaID: String(materia._id),
  };

  return Atividade.findOneAndUpdate(
    {
      planoID: dados.planoID,
      alunoID: dados.alunoID,
      "respostas.0": { $exists: true },
    },
    { $set: dados },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );
}

async function executarSeed() {
  const dbUrl = process.env.DB_URL_LOCAL || process.env.DB_URL;

  if (!dbUrl) {
    throw new Error("Defina DB_URL_LOCAL ou DB_URL antes de executar o seed.");
  }

  garantirBancoLocal(dbUrl);
  await mongoose.connect(dbUrl);

  console.log(
    "\nConectado ao MongoDB local. Iniciando seed de desenvolvimento...\n"
  );

  // 1. Professores de demonstração e seus usuários.
  const professoresConfig = [
    {
      chave: "camila",
      email: "professor1.demo@teste.com",
      nome: "Camila",
      sobrenome: "Rocha",
      cidade: "Registro",
      telefone: "13990000001",
      dataNasc: new Date("1988-04-12T12:00:00.000Z"),
      cpf: gerarCpf(basesCpf.camila),
      urlFotoProfessor: "https://i.pravatar.cc/150?img=47",
    },
    {
      chave: "rafael",
      email: "professor2.demo@teste.com",
      nome: "Rafael",
      sobrenome: "Mendes",
      cidade: "Jacupiranga",
      telefone: "13990000002",
      dataNasc: new Date("1985-09-23T12:00:00.000Z"),
      cpf: gerarCpf(basesCpf.rafael),
      urlFotoProfessor: "https://i.pravatar.cc/150?img=12",
    },
    {
      chave: "beatriz",
      email: "professor3.demo@teste.com",
      nome: "Beatriz",
      sobrenome: "Nunes",
      cidade: "Pariquera-Açu",
      telefone: "13990000003",
      dataNasc: new Date("1992-01-08T12:00:00.000Z"),
      cpf: gerarCpf(basesCpf.beatriz),
      urlFotoProfessor: "https://i.pravatar.cc/150?img=44",
    },
  ];

  const professores = {};

  for (const config of professoresConfig) {
    const usuario = await upsertUsuario({
      email: config.email,
      tipoUser: "professor",
      senha: SENHA_PROFESSOR,
    });

    professores[config.chave] = await upsertProfessor(usuario, {
      nome: config.nome,
      sobrenome: config.sobrenome,
      cpf: config.cpf,
      dataNasc: config.dataNasc,
      cidade: config.cidade,
      telefone: config.telefone,
      urlFotoProfessor: config.urlFotoProfessor,
    });
  }

  // 2. Matérias: reaproveita as existentes e cria apenas se estiverem ausentes.
  const [historia, matematica, ciencias] = await Promise.all([
    upsertMateria("História"),
    upsertMateria("Matemática"),
    upsertMateria("Ciências"),
  ]);

  // 3. Turmas: uma por professor.
  const turmas = {
    camila: await upsertTurma(professores.camila, "3º Ano A"),
    rafael: await upsertTurma(professores.rafael, "4º Ano B"),
    beatriz: await upsertTurma(professores.beatriz, "5º Ano A"),
  };

  // 4. Alunos fictícios. Quatro ficam na turma do plano/atividade mobile.
  const alunosConfig = [
    {
      chave: "marina",
      email: "aluno1.demo@teste.com",
      nome: "Marina Almeida",
      nomeResponsavel: "Renata Almeida",
      cpf: gerarCpf(basesCpf.marina),
      cpfResponsavel: gerarCpf("473829105"),
      dataNasc: new Date("2015-03-12T12:00:00.000Z"),
      telefone: "11987650001",
      turma: "camila",
      hiperfoco: { hiperfoco: "dinossauros", urlFotoHiperfoco: null },
    },
    {
      chave: "pedro",
      email: "aluno2.demo@teste.com",
      nome: "Pedro Henrique Souza",
      nomeResponsavel: "Patrícia Souza",
      cpf: gerarCpf(basesCpf.pedro),
      cpfResponsavel: gerarCpf("582930416"),
      dataNasc: new Date("2015-07-21T12:00:00.000Z"),
      telefone: "11987650002",
      turma: "camila",
      hiperfoco: { hiperfoco: "futebol", urlFotoHiperfoco: null },
    },
    {
      chave: "laura",
      email: "aluno3.demo@teste.com",
      nome: "Laura Mendes",
      nomeResponsavel: "Andréa Mendes",
      cpf: gerarCpf(basesCpf.laura),
      cpfResponsavel: gerarCpf("693041527"),
      dataNasc: new Date("2015-10-04T12:00:00.000Z"),
      telefone: "11987650003",
      turma: "camila",
      hiperfoco: { hiperfoco: "astronomia", urlFotoHiperfoco: null },
    },
    {
      chave: "gabriel",
      email: "aluno4.demo@teste.com",
      nome: "Gabriel Ferreira",
      nomeResponsavel: "Luciana Ferreira",
      cpf: gerarCpf(basesCpf.gabriel),
      cpfResponsavel: gerarCpf("704152638"),
      dataNasc: new Date("2015-12-18T12:00:00.000Z"),
      telefone: "11987650004",
      turma: "camila",
      hiperfoco: null,
    },
    {
      chave: "isabela",
      email: "aluno5.demo@teste.com",
      nome: "Isabela Rocha",
      nomeResponsavel: "Marcos Rocha",
      cpf: gerarCpf(basesCpf.isabela),
      cpfResponsavel: gerarCpf("815263749"),
      dataNasc: new Date("2014-05-09T12:00:00.000Z"),
      telefone: "11987650005",
      turma: "rafael",
      hiperfoco: { hiperfoco: "música", urlFotoHiperfoco: null },
    },
    {
      chave: "arthur",
      email: "aluno6.demo@teste.com",
      nome: "Arthur Lima",
      nomeResponsavel: "Fernanda Lima",
      cpf: gerarCpf(basesCpf.arthur),
      cpfResponsavel: gerarCpf("926374850"),
      dataNasc: new Date("2014-08-17T12:00:00.000Z"),
      telefone: "11987650006",
      turma: "rafael",
      hiperfoco: null,
    },
    {
      chave: "sofia",
      email: "aluno7.demo@teste.com",
      nome: "Sofia Nogueira",
      nomeResponsavel: "Carolina Nogueira",
      cpf: gerarCpf(basesCpf.sofia),
      cpfResponsavel: gerarCpf("137485960"),
      dataNasc: new Date("2013-02-26T12:00:00.000Z"),
      telefone: "11987650007",
      turma: "beatriz",
      hiperfoco: { hiperfoco: "animais", urlFotoHiperfoco: null },
    },
    {
      chave: "enzo",
      email: "aluno8.demo@teste.com",
      nome: "Enzo Carvalho",
      nomeResponsavel: "Roberto Carvalho",
      cpf: gerarCpf(basesCpf.enzo),
      cpfResponsavel: gerarCpf("248596071"),
      dataNasc: new Date("2013-06-14T12:00:00.000Z"),
      telefone: "11987650008",
      turma: "beatriz",
      hiperfoco: null,
    },
  ];

  const alunos = {};

  for (const config of alunosConfig) {
    const usuario = await upsertUsuario({
      email: config.email,
      tipoUser: "aluno",
      senha: SENHA_ALUNO,
    });

    alunos[config.chave] = await upsertAluno(usuario, turmas[config.turma], {
      nome: config.nome,
      nomeResponsavel: config.nomeResponsavel,
      cpf: config.cpf,
      cpfResponsavel: config.cpfResponsavel,
      dataNasc: config.dataNasc,
      telefone: config.telefone,
      urlFotoAluno: `https://i.pravatar.cc/150?u=${config.email}`,
      urlFotoLaudo: "https://placehold.co/600x800/png?text=Laudo+de+teste",
      hiperfoco: config.hiperfoco,
    });
  }

  // 5. Planos: o primeiro preserva o plano mobile de História (Idade Média).
  const planoHistoria = await upsertPlano(
    professores.camila,
    turmas.camila,
    historia,
    {
      tipoConteudo: "anexo",
      titulo: "Idade Média",
      descricao:
        "Plano de aula de História sobre a Idade Média, com explicação do conteúdo e quatro questões de fixação.",
      dataAula: new Date("2026-10-02T01:27:42.534Z"),
      dataFechamento: new Date("2026-10-09T01:28:20.908Z"),
      urlPlanoDeAula:
        "https://res.cloudinary.com/dhkotadvd/image/upload/v1793122021/plano_de_aula_historia_idade_media_xml2yr.pdf",
    }
  );

  const planosExtras = await Promise.all([
    upsertPlano(professores.camila, turmas.camila, matematica, {
      tipoConteudo: "manual",
      titulo: "Introdução às operações matemáticas",
      descricao:
        "Apresentação das quatro operações básicas e resolução de exercícios introdutórios.",
      dataAula: new Date("2026-11-05T12:00:00.000Z"),
      dataFechamento: new Date("2026-11-07T21:00:00.000Z"),
      urlPlanoDeAula: null,
    }),
    upsertPlano(professores.rafael, turmas.rafael, matematica, {
      tipoConteudo: "manual",
      titulo: "Multiplicação com dinossauros",
      descricao:
        "Atividade de multiplicação com situações-problema e exemplos visuais.",
      dataAula: new Date("2026-11-06T12:00:00.000Z"),
      dataFechamento: new Date("2026-11-10T21:00:00.000Z"),
      urlPlanoDeAula: null,
    }),
    upsertPlano(professores.beatriz, turmas.beatriz, ciencias, {
      tipoConteudo: "manual",
      titulo: "Conhecendo o sistema solar",
      descricao:
        "Introdução aos planetas, ao Sol e aos principais componentes do sistema solar.",
      dataAula: new Date("2026-11-06T12:00:00.000Z"),
      dataFechamento: new Date("2026-11-10T21:00:00.000Z"),
      urlPlanoDeAula: null,
    }),
  ]);

  // 6. Atividade gerada pela IA e resposta corrigida do banco mobile.
  // Os documentos antigos usavam userID; o model atual exige alunoID.
  // Ambos são vinculados ao _id do aluno demo Marina.
  await upsertAtividadeGerada({
    plano: planoHistoria,
    aluno: alunos.marina,
    turma: turmas.camila,
    materia: historia,
  });

  await upsertResposta({
    plano: planoHistoria,
    aluno: alunos.marina,
    turma: turmas.camila,
    materia: historia,
  });

  console.log("\nSeed de desenvolvimento concluído!\n");
  console.log("Resumo:");
  console.log(`- Professores: ${Object.keys(professores).length}`);
  console.log(`- Turmas: ${Object.keys(turmas).length}`);
  console.log(`- Alunos: ${Object.keys(alunos).length}`);
  console.log("- Matérias garantidas: História, Matemática e Ciências");
  console.log(`- Planos de aula: ${1 + planosExtras.length}`);
  console.log("- Atividades mobile: 1 gerada pela IA + 1 resposta corrigida");
  console.log("\nLogin professor para Swagger:");
  console.log("- E-mail: professor1.demo@teste.com");
  console.log(`- Senha: ${SENHA_PROFESSOR}`);
  console.log(
    "- Contas de aluno: aluno1.demo@teste.com até aluno8.demo@teste.com"
  );
  console.log(`- Senha dos alunos: ${SENHA_ALUNO}`);
  console.log("\nOs demais registros existentes não foram apagados.");
}

try {
  await executarSeed();
} catch (error) {
  console.error("\nErro ao executar seedDev:", error.message);
  process.exitCode = 1;
} finally {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}
