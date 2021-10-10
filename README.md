#### Versão em português abaixo / Portuguese version below

# English version

## Idea

As a part of an application process, I had to develop and deploy a full stack website for a store selling generic goods. The specifications were very broad: the front-end had to be done with React.js, the back-end with Node.js. The website had to have at least two pages: one page to add new items to the inventory, and another to see what the store had available to sell.

Not something particularly complicated, but... I was not sure about how to deploy the website. I already have my [homepage](https://vulpi-ideas.com) , but it not done with React, so I was not sure how to integrate the two servers together. Sure, I could use Heroku, but I feel I am not in control when I use it. There is just too much behind the scenes.

A typical joke in the field of development is the worker who claims to the boss "But in my machine it was running properly!", to which the boss replies "But we won't give your machine to the client!" So, there must be some other way to guarantee a specific piece of software, working with a specific version of a given stack, can be properly deployed and run. A common solution nowadays is to use Docker, but I still haven't had the chance to properly study that.

What I have indeed been studying is Linux system administration: what distros are available and how they difer, how to check what the tools installed in a given system are, how to use typical POSIX utils, how to automatize common routines with scripts, and so on. On that topic, please check [cadmus](https://github.com/moraesvic/cadmus) and [vidcrop](https://github.com/moraesvic/vidcrop), two tools I developed to solve the problems of configuring a PostgreSQL server and sectioning long videos into multiple files.

## How to use

The basic dependency to use this library is **ffmpeg**. In Ubuntu, this software can be installed with the command **sudo apt install ffmpeg**.

Firstly, consider whether the file format you have at hand is the desired one. If desired, make use of the script **scripts/vidconvertmp4 YOUR_FILE** to convert your files to the MP4 format. In second place, make sure that all the video files are in the **media** directory, under the root folder of the project. Now, fill the file **scripts/instructions.txt** with instructions to section your videos (use the syntax of the given file as an example). To segment, execute **scripts/vidcrop scripts/instructions.txt**.

As a final consideration, if you want to merge two video sections, write your instructions to the file **scripts/merge.txt** (according to the given example), and execute **scripts/vidconcat scripts/merge.txt media/OUTPUT_FILE**.

# Versão em português

## A ideia

Recentemente, recebi um freela de edição de vídeo. Foram duas tarefas: editar o áudio, removendo ruídos, e depois segmentar o vídeo em trechos, de acordo com os painéis e sessões apresentados no dia da gravação. Como entusiasta do movimento [Free and Open Source Software (FOSS)](https://en.wikipedia.org/wiki/Free_and_open-source_software), resolvi implementar minha solução apenas com programas gratuitos e de código-fonte aberto.

Para a segunda parte, eu teria que identificar quais são os pontos mais propícios para o corte, e depois prosseguir com qualquer ferramenta de edição de vídeo, como o [Lightworks](https://lwks.com/) ou [LosslessCut](https://github.com/mifi/lossless-cut). O problema é que, no total, tratava-se de uns 10-12 segmentos, e os clientes e eu mudamos várias vezes de opinião quanto a qual seria o melhor momento para cortar. Cortando muito cedo, o vídeo é interrompido de forma brusca, cortando atrasado, o vídeo ficava com um silêncio inoportuno. Deveríamos fundir a cerimônia de abertura com a primeira apresentação, ou cortar em dois segmentos? Manter o vídeo teaser em cada um dos clipes, ou apenas no primeiro? Fazer tudo isso repetidas vezes manualmente era trabalhoso e tendia ao erro.

Para facilitar meu trabalho, resolvi criar uma maneira automática de processar os vídeos. Em um arquivo de texto, eu poderia registrar qual arquivo deveria ser cortado, de qual ponto até qual ponto, e o que aquele segmento significava. Ao final, eu processava o arquivo de texto com um script que invocava o software [FFmpeg](https://ffmpeg.org/
), e em menos de um minuto, poderia conferir o resultado com a nova segmentação das mais de dez horas de vídeo.

## Modo de usar

O requisito básico para utilizar esta biblioteca é o **ffmpeg**. No Ubuntu, este software pode ser baixado com o comando **sudo apt install ffmpeg**.

Primeiramente, considere se o formato do arquivo do qual você dispõe é o desejado. Caso seja propício, utilize o script **scripts/vidconvertmp4 SEU_ARQUIVO** para converter seus arquivos para o formato MP4. Em segundo lugar, certifique-se que todos os arquivos de vídeo se encontram na pasta **media**, abaixo do diretório raiz do projeto. Agora, preencha o arquivo **scripts/instructions.txt** com instruções para segmentar os vídeos (use a sintaxe do arquivo fornecido como exemplo). Para segmentar, execute **scripts/vidcrop scripts/instructions.txt**.

Por último, se for desejável fundir dois segmentos de vídeo, preencha o arquivo **scripts/merge.txt** com instruções (segundo o exemplo), e execute **scripts/vidconcat scripts/merge.txt media/ARQUIVO_DE_SAIDA**.


