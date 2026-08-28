# SCP — Transférer des fichiers entre UNIX
`scp` (_Secure Copy Protocol_) permet de copier des fichiers et des dossiers entre deux machines via SSH _(à activer obligatoirement donc)_

Il n'est pas nécessaire d'être sur un même réseau.

## Envoyer un fichier

Syntaxe :

```scp fichier utilisateur@IP_DU_DESTINATAIRE:/chemin/destination/```

Exemple :

```scp document.txt pi@192.168.1.15:/home/pi/```

_Le fichier_ `_document.txt_` _sera copié dans_ `_/home/pi/_` _sur le Raspberry Pi._

> [!IMPORTANT]
> _Pour envoyer un dossier entier, on utilise l'argument_ **\-r**.

## Récupérer un fichier depuis le Raspberry Pi

La commande fonctionne également dans l'autre sens.

```scp pi@192.168.1.50:/home/pi/document.txt .```

Le fichier sera téléchargé dans le répertoire courant. L'argument `-r` est toujours valable.