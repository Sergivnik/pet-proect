-- MySQL dump 10.13  Distrib 8.0.22, for Win64 (x86_64)
--
-- Host: localhost    Database: pet_proect
-- ------------------------------------------------------
-- Server version	8.0.22

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `oders`
--

DROP TABLE IF EXISTS `oders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `value` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idoders_UNIQUE` (`id`),
  UNIQUE KEY `value_UNIQUE` (`value`)
) ENGINE=InnoDB AUTO_INCREMENT=668 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oders`
--

LOCK TABLES `oders` WRITE;
/*!40000 ALTER TABLE `oders` DISABLE KEYS */;
INSERT INTO `oders` VALUES (1,'L 4 B'),(15,'А-Групп'),(2,'А1 (Транссистема)'),(3,'АВИА ОК'),(4,'АвтоГраф'),(5,'Автодон'),(6,'Автокомпас'),(7,'АвтоТрансХолдинг'),(8,'Агат-Сервис'),(9,'Агис'),(10,'Агрис'),(11,'Агро-Дон'),(12,'Агропрайм'),(13,'АгроТех'),(14,'Агрофирма'),(16,'АДАМ'),(17,'Азов-ТЭК'),(18,'Айрон'),(19,'Актрос'),(20,'Алисс'),(21,'Альтернатива'),(22,'Альфа'),(23,'Альфа Снаб'),(24,'Альфа-Инжиниринг'),(25,'АМД'),(26,'АМИ'),(27,'Амрита'),(28,'Анастасия'),(29,'АнгарЮгСтрой'),(30,'АПЕКС'),(31,'АПТ-Юг'),(32,'АПФ Дон'),(33,'Ареэль'),(34,'Ариэль Металл'),(35,'Ариэль ТК Русь'),(36,'АРМА'),(37,'АСМ'),(38,'Астра-Тор'),(39,'Атлант'),(40,'Атлантис'),(41,'АТП 20-17'),(42,'Аттракцион'),(43,'Баба Люба'),(44,'Базис Логистик'),(45,'Базис-Логистик'),(46,'Балкер'),(47,'Балкер (ТСК)'),(48,'Балкер ТСК'),(49,'Балкер(ТСК)'),(50,'Беликов'),(51,'БЛК'),(52,'Брихачев'),(53,'БТК Плюс'),(54,'Варвара'),(55,'ВАТ'),(56,'Велес'),(57,'Велс Инжиниринг'),(58,'Вентпром'),(59,'Вентпромрегион'),(60,'Вертикаль'),(61,'Виктория'),(62,'ВНВ'),(63,'Внешинформ'),(64,'Водоканал'),(65,'Возрождение'),(66,'Володя СГЮГ'),(67,'Восток-Дон'),(68,'ВРС'),(69,'ВСК'),(70,'ВСК Строй'),(71,'Галицкий'),(72,'Гарант'),(73,'Генподряд-61'),(74,'Гермес'),(75,'Гефест'),(76,'Гидробарьер '),(77,'ГК КМ'),(78,'ГК КМ '),(79,'ГК УПСК'),(80,'ГлавСпецСтрой'),(81,'ГлобалТрансИнвест'),(82,'Глобус'),(83,'Голденпласт'),(84,'Грабов'),(85,'Градстрой'),(86,'Гражданпромстрой'),(87,'Граско-профиль'),(88,'Грейнком'),(89,'Григорьева'),(90,'Дентар'),(91,'Департ.Логистики'),(92,'Деркул'),(93,'ДетальПроект'),(94,'ДжиАр'),(95,'ДМК'),(96,'ДМК ООО'),(97,'Дока'),(98,'Должанка'),(99,'Донагромаш'),(100,'Донметалл'),(101,'Донметизпром'),(102,'ДонМетКом'),(103,'Донотвод'),(104,'Донпроммет'),(105,'Донская Корона'),(106,'Донспецмаш'),(107,'ДонСтальГрупп'),(108,'Донтехпром'),(109,'ДонТрейд'),(110,'Донэкс'),(111,'Допроммет'),(112,'ДорСервисСтрой'),(113,'Дружба'),(114,'ДТК'),(115,'ДЭВО'),(116,'ДЭП Групп'),(117,'Еврометстрой'),(118,'Ейск-Приазовье-Порт'),(119,'ЕТК НИКА'),(120,'Железяка'),(121,'Жестянщик'),(122,'Жорик'),(123,'Звезда'),(124,'Земстрой'),(125,'ЗКС'),(126,'ЗМК'),(127,'ЗМК Авангард'),(128,'ЗТК'),(129,'ИВМ'),(130,'Импульс'),(131,'Импэкс'),(132,'Импэкс-Дон'),(133,'Инком (Сталь-Инвест)'),(134,'Инпром'),(135,'Инпром Сочи'),(136,'Инпром-эстейт'),(137,'Инстальторг'),(138,'Интексстрой'),(139,'Интерпайп'),(140,'Интерфил'),(141,'Интэк'),(142,'Инфо Кар'),(143,'ИП Абдулгалимов'),(144,'ИП Аллахвердян'),(145,'ИП Андреев'),(146,'ИП Балабаев'),(147,'ИП Беликов'),(148,'ИП Бойко О.Н.'),(149,'ИП Братерский'),(150,'ИП Воловик'),(151,'ИП Гальцов'),(152,'ИП Гладкова (Тракер)'),(153,'ИП Голубева'),(154,'ИП Даниэлян'),(155,'ИП Ефимова'),(156,'ИП Кобицкий'),(157,'ИП Кобицкой'),(158,'ИП Ковылина'),(159,'ИП Кокарева'),(160,'ИП Компанец'),(161,'ИП Конутенко'),(162,'ИП Коротенко'),(163,'ИП Краснянская'),(164,'ИП Лемешко'),(165,'ИП Лозенко'),(166,'ИП Маркова'),(167,'ИП Марченко'),(168,'ИП Матвиенко'),(169,'ИП Михалев'),(170,'ИП Морозова'),(171,'ИП Мурзин'),(172,'ИП Мухтарова'),(173,'ИП Назаренко'),(174,'ИП Науменко'),(175,'ИП Никонов'),(176,'ИП Окулова'),(667,'ИП Ольшанская'),(177,'ИП Писаренко'),(178,'ИП Попкова'),(179,'ИП Попов'),(180,'ИП Псапитов'),(181,'ИП Расулова'),(182,'ИП Рыбиков'),(183,'ИП Самсонов'),(184,'ИП Сбытов'),(185,'ИП Тарасенко'),(186,'ИП Тимашкова'),(187,'ИП Туменко'),(188,'ИП Турал'),(189,'ИП Федотова'),(190,'ИП Цуман'),(191,'ИП Шеркунов'),(192,'ИП Шешенко'),(193,'ИР'),(194,'ИРИДИЯ'),(195,'Иствард-Ростов'),(196,'ИТК'),(197,'ИТК Юг'),(198,'Камелот'),(199,'Канопус'),(200,'КАП Строй'),(201,'Карбофер'),(202,'Каркас'),(203,'Кармет'),(204,'Каялов'),(205,'Кирпичный з-д'),(206,'Клиент'),(207,'КМ Автотранс'),(208,'Ковылина'),(209,'Командор'),(210,'Комкас'),(211,'Коммет'),(212,'Комп.Снабж.Мет'),(213,'Компания Строймет'),(214,'Комплекс (СКСПСтрой)'),(215,'Комплексное Снабжение Металлами'),(216,'Комплектсервис-К'),(217,'КомплектСтрой Брянск'),(218,'КомТех'),(219,'Контакт'),(220,'Континент'),(221,'КорпМет'),(222,'Корпорация'),(223,'КП ВЕЛЕС'),(224,'КранСтрой'),(225,'Крафт'),(226,'КСК'),(227,'КСМ'),(228,'КСМ-8'),(229,'КТК-Транс'),(230,'Кубаньгруз'),(231,'Куйбышевская Нерудная Компания'),(232,'Курашкина'),(233,'Лазер КМ'),(234,'ЛазерТех'),(235,'Лакшми'),(236,'ЛееОк'),(237,'Леман'),(238,'Лерос'),(239,'Лидер'),(240,'Лидерстрой'),(241,'Логинпром'),(242,'Логистика 61'),(243,'Люксор'),(244,'Магнус'),(245,'Максипром'),(246,'Малахит'),(247,'МБА (Норма-Дон)'),(248,'МБЮГ'),(249,'МЕГА'),(250,'Мегапром'),(251,'Медведев'),(252,'Мелакстрой'),(253,'Мериадин'),(254,'Меридиан'),(255,'Металком'),(256,'Металл Альянс'),(257,'Металл И Жесть'),(258,'Металл Юг'),(259,'Металл-Актив'),(260,'Металл-Альянс'),(265,'Металл-Маркет'),(274,'Металл-Сервис'),(275,'Металл-Сервис (Т)'),(261,'МеталлИндустрия'),(262,'МеталлКом'),(263,'МеталлКомплект-М'),(264,'МеталлМаркет'),(266,'Металлопоставка'),(267,'Металлопрофильный Завод'),(268,'Металлоторг'),(269,'Металлоторг (ДонТрйд)'),(270,'Металлпроект'),(271,'Металлпром'),(272,'Металлпроминвест'),(273,'МЕТАЛЛСЕРВИС'),(276,'МеталлсервисКомплект'),(277,'МеталлСнаб'),(278,'Металлторг'),(279,'Металлторг (Донтрейд)'),(280,'Металлэкспорт'),(281,'МетаТрейд'),(282,'Метинввест'),(283,'Метинвест'),(284,'Метинвест Волгоград'),(285,'Метинвест Краснодар'),(286,'Метинвест Москва'),(287,'Метинвест Питер'),(288,'Метинвест-Воронеж'),(290,'Метинвест-М'),(291,'Метинвест-М1'),(289,'МетинвестКраснодар'),(292,'МЕТКОМПЛЕКТ'),(293,'Метпроект'),(294,'Метрис'),(295,'МЕТТАЛОСНАБ'),(296,'Метэкс'),(297,'Мимакс'),(298,'МИР'),(299,'МК-М'),(300,'ММК'),(301,'МОДУЛЬ'),(302,'Монтажавтоматика'),(303,'МонтажСервис'),(304,'Морион'),(305,'МорМет'),(306,'Моряк'),(307,'МОСТ'),(308,'МС'),(310,'МС-Комплект'),(311,'МС-Краснодар'),(309,'МСК'),(312,'МСЮГ'),(313,'Мурзин'),(314,'НАТЭК'),(315,'Натэк (Алипаша)'),(316,'НАТЭК НЕФТИХИММАш'),(317,'НВМСнаб'),(318,'не выставлять'),(319,'Небоскреб'),(321,'Невин. Профиль'),(322,'Нефтемаш'),(323,'Нефтехимкомплект'),(324,'НИКА'),(325,'Новопокровскагромаш'),(326,'Норма-Дон'),(327,'Норстил'),(328,'НорСтилл'),(329,'НПО НАТЭК'),(330,'НТ'),(331,'ОАО « Имени Калинина»'),(332,'ОВО-Транс'),(333,'ОКМ'),(334,'ОМБ'),(335,'Оникс'),(336,'Опора'),(337,'Опторг'),(338,'ОптТоргСервис'),(339,'Орбита (Профит)'),(340,'Орбита (СпецТрансСервис)'),(341,'Павлова'),(342,'Паритет'),(343,'ПАРТНЕР'),(344,'Партнер-Групп'),(345,'Пегас'),(346,'ПК'),(347,'ПК РуссМеталл 48'),(348,'ПКФ Гидротехснаб'),(349,'Платон'),(350,'Платонов'),(351,'ПМ-61'),(352,'ПМП Натэк'),(353,'Полет'),(354,'Полет-сервис'),(355,'Полимер Групп'),(356,'ПолимерПром'),(357,'Полюс Сталь'),(358,'Праймет (Ю-мет)'),(359,'Пресмаш'),(360,'Прессмаш'),(361,'Прогресс'),(362,'Промагро'),(363,'Промвентиляция'),(364,'Промдетали'),(365,'Проминвестстрой'),(366,'Проминдустрия'),(367,'Проммаш'),(368,'Промметалл'),(369,'Проммонтаж'),(370,'Промотрейд'),(371,'Промпутьснаб'),(372,'Промресурс'),(373,'Промснаб'),(374,'Промснабжение'),(375,'Промсталь'),(376,'Промстил (БТК)'),(377,'Промстройторг'),(378,'ПромТехнологии'),(379,'Промтехстрой'),(380,'Промтяжмаш'),(381,'Профит'),(383,'Профит-Транс'),(382,'ПрофитТранс'),(384,'Профуниверсал'),(385,'Прочная Сталь'),(386,'ПТК'),(387,'РБК-Строй'),(388,'РГМК'),(389,'РегионМеталлСервис'),(390,'РемАгроМаш'),(391,'РЕМСЕРВИС'),(392,'Ремстрой'),(393,'Ремстройсервис'),(394,'РемСтройТранс'),(395,'Рента'),(396,'РЗМК'),(397,'РИМ'),(398,'Ринстальстрой'),(399,'РИО'),(400,'РЛЗ'),(401,'РМ'),(402,'РМК'),(403,'РНГМ'),(404,'Рома'),(405,'Рослогистика'),(406,'Росметком'),(407,'Роспром'),(408,'РосСтройКоплект'),(409,'РосСтройСантехМонтаж'),(411,'Рост-Дон'),(410,'РостВторМет'),(412,'РостМетКом'),(413,'Ростов Экспресс'),(414,'Ростовский порт'),(415,'РОСТОВТАРА'),(416,'РостПожСнаб'),(417,'Ространслогистик'),(418,'Ространслогистика'),(419,'Ростсельмаш'),(420,'РостСтройКом'),(421,'Ростстроймонтаж'),(422,'Росцинк'),(423,'РСК'),(424,'РСМ'),(425,'РСТ'),(426,'РТК'),(427,'РТПЗ (Айрон)'),(428,'РТС'),(429,'Рукавица'),(430,'РусМет'),(431,'РусПромСталь'),(432,'Руспромсталь-Кубань'),(433,'Руспромсталь-Юг'),(434,'Русский Металл'),(440,'С-Вкомплекс'),(435,'САРМАТ'),(436,'Сбытов'),(437,'Сбытов '),(438,'Сбытова '),(439,'СВ&Со'),(441,'СГ Юг'),(442,'СДД'),(443,'СДТ'),(444,'СервисМеталлЦентр'),(445,'СИАНА'),(446,'Сиджар'),(447,'СК Гидропресс'),(448,'СК Монарх'),(449,'СК СП Строй'),(450,'СЛК'),(451,'СМД'),(452,'СМК'),(453,'СМЦ'),(454,'СМЦ '),(455,'СМЦ  ЮГ'),(456,'СнабСервис'),(457,'Спецсталь'),(458,'Спецтехмаш'),(459,'Спецэнергоснаб'),(460,'СпецЭнергоТрансСервис'),(461,'СПОРТМАШ'),(462,'СРП'),(463,'Срыбный'),(464,'ССЮ'),(465,'СТ'),(466,'Ставмолопторг'),(467,'Сталь Трейд Н.Новг.'),(468,'Сталь-инвест'),(469,'Стальинтекс'),(470,'Стальинтекс '),(471,'Стальинтекс ТК'),(472,'Сталькомплект'),(473,'СтальНова'),(474,'Стальпром'),(475,'Стальпром ЮГ'),(477,'Стальпром-Комплект'),(476,'Стальпромкомплект'),(478,'Стальпромкоплект'),(479,'СтальСтрой'),(480,'СтальСтройТСК'),(481,'СтальТрейд'),(482,'СтальЦветМет'),(483,'СтанкоТехЦентр'),(484,'Степанов'),(485,'Стилл (Ю-Мет)'),(486,'СтиллЛайн'),(487,'СтиллМаркет'),(488,'СтилМаркет'),(489,'СТРОЕР'),(490,'Строительный Союз'),(491,'Строй Тех'),(492,'СтройДвор'),(493,'Стройдом'),(494,'СтройКомплектСервис'),(495,'СтройКонсалт'),(496,'СтроймастерКМВ'),(497,'Стройматериалы'),(498,'Стройматерия'),(499,'Строймаш-Комплект'),(500,'Строймет'),(501,'Строймет ПМ'),(502,'Стройметаллсервис'),(503,'СТРОЙМОНТАЖ'),(504,'СтройтехАгро'),(505,'СТРОЙТЕХМОНТАЖ'),(506,'СтройтехСнаб'),(507,'Стройтрубосталь'),(508,'СтройТэк'),(509,'СтройФорум'),(510,'СТС'),(511,'Сфера'),(512,'Таганремонт'),(513,'ТаганРемСтрой'),(514,'ТаганрогСтальМост'),(515,'Таганстальсервис'),(516,'ТАГМАШ'),(517,'Тагмет'),(518,'ТагМеталлСтрой'),(519,'ТАГПРОМСТРОЙ'),(520,'ТагСтройМеталл'),(521,'ТактиМет'),(522,'ТД ДМГ'),(523,'ТД ДМК'),(524,'ТД ДонМетизГрупп'),(525,'ТД Металл'),(526,'ТД Металлпром'),(527,'ТД МеталлСнаб'),(528,'ТД ОСТ'),(529,'ТД Ресурс'),(530,'ТД Снабжение'),(531,'ТД Станкотехцентр'),(532,'ТД Углерод'),(533,'ТД Шаповалов'),(534,'ТД Югснабсервис'),(535,'ТД Югснабсервис '),(536,'ТДС'),(537,'Тензор-Т'),(538,'Теплодон'),(539,'Теплосервис'),(540,'Терминоал-Т'),(541,'Техальянс'),(542,'ТехМаш Ростов'),(543,'Техресурс'),(544,'Техсталь'),(545,'ТИФЛИС'),(546,'ТК Л-Юг'),(547,'ТК МАКС'),(548,'ТК Миля'),(549,'ТК Ростсельмаш'),(550,'ТК Сервис Плюс'),(551,'ТК ССШЭ'),(552,'ТКЗ Энерго'),(553,'ТКЗ-НТС'),(554,'ТЛЗ'),(555,'ТМК'),(556,'ТМК Юг'),(557,'ТоргТранс'),(558,'ТОРГЮГМЕТ'),(559,'ТПК РОСТ'),(560,'ТПС'),(561,'Транс Авто'),(562,'Транском'),(563,'Транссеверлес'),(564,'Транссервис'),(565,'Транссистема'),(566,'ТРИ-С'),(567,'Трубная МБ'),(568,'ТрубоСталь'),(569,'Трубосталькомплект'),(570,'Трубы 2000'),(571,'ТСК'),(572,'ТСС'),(573,'ТЭК Вектор'),(574,'ТЭКО'),(575,'ТЭМП'),(576,'ТЭРЗ'),(577,'УралСибТрейд'),(578,'УралТрубоСталь'),(579,'Фаворит'),(580,'ФерроТрейд'),(581,'Феста Стройгрупп'),(583,'ФОР-МЕТ'),(582,'Формет'),(584,'Формула'),(585,'ФреймКад'),(586,'ФреймКад ЛСК'),(587,'Химальянс'),(588,'ХозАгро'),(589,'Хребет'),(591,'Центр-сталь'),(590,'Центрсталь'),(592,'ЦПР'),(593,'ЦРМО'),(594,'ЧЗЖИ'),(595,'Шаман'),(596,'Шахт.профиль'),(597,'Шешенко'),(598,'ЭкономСтрой'),(599,'Элекор-Ростов'),(600,'ЭлектроРемЗавод'),(601,'Электроцинк'),(602,'Элиттранс-Рязань'),(603,'Эмерлинк'),(604,'Энергопроект (сербы)'),(605,'Энерготех'),(606,'Энергофлот'),(607,'ЭПМ-НЭЗ'),(608,'Эскорт'),(609,'Эстейт Инпром'),(610,'Эфко'),(642,'Ю-Мет'),(611,'Юг Индустрия'),(612,'ЮгАвтоРесурс'),(613,'Югбизнесцентр'),(614,'ЮгКомплект'),(615,'ЮгМеталл'),(616,'Югметаллинвест'),(617,'ЮгМеталлСнаб'),(618,'ЮгМеталлСтрой'),(619,'ЮгМетСнаб'),(620,'ЮгМетТрейд'),(621,'Югпром'),(622,'Югпром 1'),(623,'Югпром1'),(624,'ЮгПромметалл'),(625,'Югпромсистемы'),(626,'ЮгПромСнаб'),(627,'Югпрофиль'),(628,'ЮгРо'),(629,'Югснабсервис'),(630,'Югснабсервис ТД'),(631,'ЮгСпецСвязь'),(632,'Югспецстрой'),(633,'Югсталь'),(634,'ЮгСталь-Метиз'),(635,'ЮгСтальТорг'),(636,'Югтехкомплект'),(637,'Югэлитастрой'),(638,'ЮгЭлитСтрой'),(639,'ЮИК'),(640,'ЮКС'),(641,'ЮЛК'),(643,'ЮМИ'),(644,'ЮМИ '),(645,'ЮМК'),(646,'ЮМС'),(647,'ЮМСХ'),(648,'Юнайтед'),(649,'Юнити'),(650,'Юнити Констракшн'),(651,'Юпитер'),(652,'ЮСА'),(653,'ЮСК-Инвест'),(654,'ЮСМ'),(655,'ЮСС'),(656,'ЮСТК'),(657,'ЮТК'),(658,'ЮТС-металл'),(659,'ЮТС-огнеупор'),(660,'ЮТЭКО'),(661,'Ющенко'),(662,'ЮЭко');
/*!40000 ALTER TABLE `oders` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-03-09  8:57:45