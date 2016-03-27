USE [tdoLatest]
GO
/****** Object:  StoredProcedure [trans].[uspUploadDeduction]    Script Date: 26/03/2016 09:26:14 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


ALTER PROCEDURE [dbo].[uspUploadRegister]
(
@jobNumber VARCHAR(30),
@dateReceived DATETIME,
@expiryDate DATETIME,
@status VARCHAR(15),
@cargoType VARCHAR(100),
@fileRef VARCHAR(50),
@destination VARCHAR(100),
@terminal VARCHAR(100),
@containerNo VARCHAR(15),
@returnTerminal VARCHAR(100),
@truck VARCHAR(20),
@tdoReceiptDate DATETIME,
@schDelDate DATETIME,
@loadingTime DATETIME,
@dispatchTime DATETIME,
@remarks VARCHAR(255),
@createdByID INT,
@sessionID UNIQUEIDENTIFIER
)

AS

SET NOCOUNT ON 

BEGIN
		DECLARE @isSuccess BIT = 0
		DECLARE @response VARCHAR(MAX) = '', @rqd VARCHAR(20) = 'is invalid', @exist VARCHAR(20) = 'already exist'

		DECLARE @jobN VARCHAR(15), @cargoT INT, @dest INT, @term INT, @rTerm INT, @trk INT;

		IF RTRIM(LTRIM(@jobNumber)) = '' OR @jobNumber IS NULL
			SET @response += 'Job Number ' + @rqd
		ELSE IF EXISTS(SELECT 1 FROM TDOR WHERE jobNumber = @jobNumber)
			SET @response += 'Job Number '+ @exist 

		IF RTRIM(LTRIM(@cargoType)) = '' OR @cargoType IS NULL
			SET @response += '; Cargo Type ' + @rqd
		ELSE IF NOT EXISTS(SELECT 1 FROM CART WHERE cargoTypeName = RTRIM(LTRIM(@cargoType)))
			SET @response += '; Cargo Type ' + @rqd
		ELSE
			SELECT @cargoT = cargoTypeID FROM CART WHERE cargoTypeName = cargoTypeName
		
		IF RTRIM(LTRIM(@destination)) = '' OR @destination IS NULL
			SET @response += '; Destination ' + @rqd
		ELSE IF NOT EXISTS(SELECT 1 FROM CITD WHERE cityName = RTRIM(LTRIM(@destination)))
			SET @response += '; Destination ' + @rqd
		ELSE
			SELECT @dest = cityID FROM CITD WHERE cityName = RTRIM(LTRIM(@destination))

		IF RTRIM(LTRIM(@terminal)) = '' OR @terminal IS NULL
			SET @response += '; Terminal ' + @rqd
		ELSE IF NOT EXISTS(SELECT 1 FROM TERD WHERE terminalName = RTRIM(LTRIM(@terminal)))
			SET @response += '; Terminal ' + @rqd
		ELSE
			SELECT @term = terminalID FROM TERD WHERE terminalName = RTRIM(LTRIM(@terminal))

		IF RTRIM(LTRIM(@returnTerminal)) = '' OR @returnTerminal IS NULL
			SET @response += '; Return Terminal ' + @rqd
		ELSE IF NOT EXISTS(SELECT 1 FROM TERD WHERE terminalName = RTRIM(LTRIM(@returnTerminal)))
			SET @response += '; Return Terminal ' + @rqd
		ELSE
			SELECT @rTerm = terminalID FROM TERD WHERE terminalName = RTRIM(LTRIM(@returnTerminal))

		IF RTRIM(LTRIM(@truck)) = '' OR @truck IS NULL
			SET @response += '; Truck ' + @rqd
		ELSE IF NOT EXISTS(SELECT 1 FROM TRUD WHERE regNumb = RTRIM(LTRIM(@truck)))
			SET @response += '; Truck ' + @rqd
		ELSE
			SELECT @trk = truckID FROM TRUD WHERE regNumb = RTRIM(LTRIM(@truck))

		IF RTRIM(LTRIM(@response)) = '' 
			BEGIN
				BEGIN TRANSACTION
				BEGIN TRY -- SELECT * FROM TRANS.PayrollDetail
			
					INSERT INTO TDOR ( jobNumber, dateReceived, expiryDate, [status], cargoTypeID, fileRef, destinationID, terminalID, 
					containerNo, returnTerminal, truckID, tdoReceiptDate, schDelDate, loadingTime, dispatchTime, remarks, createdByID, sessionID)

					VALUES (@jobNumber, @dateReceived, @expiryDate, @status, @cargoT, @fileRef,@dest, @term, @containerNo, @rTerm, 
							@trk, @tdoReceiptDate, @schDelDate, @loadingTime, @dispatchTime, @remarks, @createdByID, @sessionID);

					SET @response= 'Success'
					SET @isSuccess = 1;
				COMMIT TRANSACTION
	
				END TRY
				BEGIN CATCH
					ROLLBACK TRANSACTION
					set @isSuccess  = 0
					set @response = dbo.ufnSystemGetErrorInfo(); 
				END CATCH
			END
	SELECT	@jobNumber as [jobNumber],
			@dateReceived as [dateReceived],
			@expiryDate as expiryDate,
			@status as status,
			@cargoType as cargoType,
			@fileRef as fileRef,
			@destination as destination,
			@terminal as terminal,
			@containerNo as containerNo,
			@returnTerminal as returnTerminal,
			@truck as truck,
			@tdoReceiptDate as tdoReceiptDate,
			@schDelDate as schDelDate,
			@loadingTime as loadingTime,
			@dispatchTime as dispatchTime,
			@remarks as remarks,
			@isSuccess as isSuccess,
			@response as response

END
