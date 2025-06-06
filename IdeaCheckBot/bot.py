
import logging
import asyncio



from aiogram import Bot, Dispatcher, F
from aiogram.enums.parse_mode import ParseMode
from aiogram.filters import CommandObject
from aiogram.types import Message, LabeledPrice, InlineKeyboardButton, InlineKeyboardMarkup, CallbackQuery, \
    PreCheckoutQuery
from aiogram.filters import Command
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.client.default import DefaultBotProperties

import os
import requests
from aiogram.utils.keyboard import InlineKeyboardBuilder
from dotenv import load_dotenv
load_dotenv()
API_TOKEN = os.getenv("API_TOKEN")
API_BASE_URL = "http://83.222.16.195"
SECRET_API_TOKEN = os.getenv('SECRET_API_TOKEN')

# Логирование
logging.basicConfig(level=logging.INFO)

# Создаём бота с новым способом установки parse_mode
bot = Bot(
    token=API_TOKEN,
    default=DefaultBotProperties(parse_mode=ParseMode.HTML)
)

# Диспетчер
dp = Dispatcher(storage=MemoryStorage())

# /start
@dp.message(F.text == "/start")
async def start_handler(message: Message):
    await message.answer("Привет! Введи логин, как на сайте:")

def payment_keyboard():
    builder = InlineKeyboardBuilder()
    builder.button(text=f"Оплатить 1 ⭐" , pay=True)
    return builder.as_markup()

# логи
@dp.message(F.text.regexp(r"^\w+$"))
async def check_login(message: Message):
    login = message.text.strip()

    try:
        response = requests.get(f"{API_BASE_URL}/api/check-user/?login={login}")
        data = response.json()
        if response.status_code == 200 and data.get("found"):

            keyboard = InlineKeyboardMarkup(
                inline_keyboard=[
                    [InlineKeyboardButton(text="Купить PRO", callback_data=f"buy:{login}")]
                ]
            )
            await message.answer(f"✅ {login} найден. Готовы к оплате!", reply_markup=keyboard)


        else:
            await message.answer("❌ Логин не найден."  )

    except Exception as e:
        await message.answer("⚠️ Ошибка при запросе к API")
        logging.error(e)

@dp.callback_query(F.data.startswith("buy:"))
async def buy_handler(callback: CallbackQuery):
    login = callback.data.split(":")[1]
    prices = [LabeledPrice(label="XTR" , amount=1 )]
    await bot.send_invoice(
        chat_id=callback.from_user.id,
        title="Покупка PRO подписки",
        description=f"Покупка подписки про для аккаунта {login}",
        prices=prices,
        provider_token="",
        payload=login,
        currency="XTR",
        reply_markup=payment_keyboard()
)
@dp.pre_checkout_query()
async def pre_checkout_handler(per_checkout_query: PreCheckoutQuery):
    await per_checkout_query.answer(ok=True)
@dp.message(Command('refund'))
async def command_refund_handler(message: Message , bot: Bot , command: CommandObject) -> None:
    translation_id = command.args
    try:
        await bot.refund_star_payment(
            user_id=message.from_user.id,
            telegram_payment_charge_id=translation_id
        )
    except Exception as e:
        print(e)
@dp.message(F.successful_payment)
async def process_successful_payment(message: Message) -> None:
    login = message.successful_payment.invoice_payload

    try:
        headers = {
            'Authorization': f'Bearer {SECRET_API_TOKEN}'
        }
        response = requests.get(f'{API_BASE_URL}/api/update-user-status/?login={login}', headers=headers)
        if response.status_code==200:
            await message.answer("Статус успешно обновлён")
        else:
            await message.answer("Ошибка")
    except Exception as e:
        await message.answer("Произошла ошибка при запросе к backend")


    await message.answer(f'{message.successful_payment.telegram_payment_charge_id}', message_effect_id="5104841245755180586")

# Запуск
async def main():
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())

