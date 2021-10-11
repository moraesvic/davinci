#### Versão em português abaixo / Portuguese version below

# English version

## Idea

As a part of an application process, I had to develop and deploy a full stack website for a store selling generic goods. The specifications were very broad. The only rules were: the front-end had to be done with React.js, the back-end with Node.js; the website had to have at least two pages: one page to add new items to the inventory, and another to see what the store had available to sell.

Not something particularly complicated, but... I was not sure about how to deploy the website. I already have my [homepage](https://vulpi-ideas.com) , but it not done with React, so I was not sure how to integrate the two servers together (the original one, containing tools for language learning, and the new one, for this project). Sure, I could use Heroku, but I feel I am not in control when I use it. There is just too much behind the scenes.

A typical joke in the field of development is the worker who claims to the boss "But in my machine it was running properly!", to which the boss replies "But we won't give your machine to the client!" So, there must be some other way to guarantee a specific piece of software, working with a specific version of a given stack, can be properly deployed and run. A common solution nowadays is to use Docker, but I still haven't had the chance to properly study that.

What I have indeed been studying is Linux system administration: what distros are available and how they difer, how to check what the tools installed in a given system are, how to use typical POSIX utils, how to automatize common routines with scripts, and so on. On that topic, please check [cadmus](https://github.com/moraesvic/cadmus) and [vidcrop](https://github.com/moraesvic/vidcrop), two tools I developed to solve the problems of configuring a PostgreSQL server and sectioning long videos into multiple files. After having tackled these smaller tasks, I felt comfortable for something more complicated: the script for deployment is now quite thorough, covering a lot of corner cases, and amounting to almost 400 lines — not that much, but Bash is quite expressive in comparison to C, for example, and also has got weird syntax, non-intuitive behavior and pain-staking bugs.

So, here is a simple, but well-rounded full stack server, with batteries included. Ideally, one would be able to start with a basic Linux (virtual or real) machine (Debian, CentOS, etc), clone the repo, install some dependencies, and have everything done in a fool-proof way within around 10 minutes. Then, with the basic API and client, it is easy to expand by just following design patterns.

The goal was to understand the best practices and enforce them with automatization, minimizing the time spent taking decisions and consulting documentation.

## How to use

Clone this repository, then run **./deploy**, it will tell you what the dependencies are and conduct you through the installation. The place where you might have some difficulty is nginx, but pay attention to the messages in the wizard setup, and everything will probably be fine. In the worst case scenario, you might need to do some manual changes, but the script **./deploy** and the scripts in **/conf/** should be well-documented enough to understand what you need to do.

Have fun!

## Screenshots / Demonstration

Coming soon...

# Versão em português

## A ideia

Como parte de um processo seletivo para desenvolvedor, eu tive que criar e apresentar um site full stack para uma loja vendendo produtos genéricos. As especificações eram bastante abrangentes. As únicas regras eram: o front-end tinha que ser feito com React.js, o back-end com Node.js; o site precisava ter pelo menos duas páginas: uma página para adicionar novos itens ao inventário, e outra para visualizar o que a loja possuía disponível para vender.

A proposta não era particularmente complicada, mas... eu ainda não tinha certeza sobre a melhor maneira de hospedar o site. Eu já tenho [minha própria página](https://vulpi-ideas.com) , mas eu não a fiz com React, então não tinha certeza de como integrar os dois servidores junto (o original, que contém ferramentas para o aprendizado de idiomas, e este novo, com a proposta de loja). Claro, eu poderia usar o Heroku para hospedar o novo projeto, mas eu sinto que a plataforma não me permite controle algum, é muita coisa acontecendo por trás das cortinas.

Uma célebre piada na área de desenvolvimento é o funcionário que alega para o seu chefe "Mas no meu computador estava funcionando direitinho!", ao qual o chefe responde "É, mas não vamos dar o seu computador para o cliente" Então, é necessário haver alguma outra maneira de garantir que um software específico, trabalhando com uma versão específica de uma dada stack, possa ser propriamente hospedado e rodar direitinho. Uma solução comum nos dias de hoje é usar o Docker, mas eu ainda não tive a chance de estudá-lo como gostaria.

Por outro lado, o que eu venho de fato estudando é administração de sistemas Linux: quais distros existem e como elas diferem umas das outras, como verificar quais são as ferramentas instaladas em um dado sistema, como usar as ferramentas típicas POSIX, como automatizar rotinas comuns com scripts, e por aí vai. A respeito disso, convido-os a visitar o projeto [cadmus](https://github.com/moraesvic/cadmus) e o [vidcrop](https://github.com/moraesvic/vidcrop), duas ferramentas que eu criei para resolver os problemas de configurar um servidor PostgreSQL e de seccionar longos vídeos em múltiplos arquivos. Depois de ter encarado essas tarefas menores, eu me senti confortável para algo um pouco mais complicado: o script de instalação é bastante minucioso, cobrindo muitos casos-limite, e chegando a quase 400 linhas — não é tanto assim, mas Bash é bastante expressivo em comparação com C, por exemplo, e também tem uma sintaxe esquisita, comportamento não-intuitivo e bugs irritantes.

Pois bem, aqui está um servidor full stack simples, mas arredondado, e com baterias inclusas. Idealmente, seria possível que uma pessoa que tivesse uma máquina (virtual ou real) Linux (Debian, CentOS, etc) conseguisse clonar este repositório, instalar as dependências necessárias, e ter tudo pronto e à prova de erros por volta de 10 minutos. Aí, com uma API básica e o cliente pronto, é muito fácil de continuar expandindo, simplesmente seguindo os padrões de design.

O objetivo foi compreender as melhores práticas e forçar sua adoção por meio da automação, minimizando o tempo gasto na tomada de decisões e na consulta de documentação.

## Modo de uso

Clone esse repositório, depois rode **./deploy**, o assistente de instalação vai lhe dizer quais são as bibliotecas necessárias e conduzi-lo através dos próximos passos. O ponto que pode dar algum tipo de problema é o nginx, mas preste atenção às mensagens do assistente de instalação, e provavelmente vai dar tudo certo. No pior dos casos, é possível que você tenha que fazer algumas modificações manuais, mas o script **./deploy** e os scripts em **/conf/** estão documentados bem o suficientes para ilustrar o que é necessário fazer.

Divirta-se!

## Screenshots / Demonstração

Em breve...